import axios, { AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const now = Date.now() / 1000;
    return decoded.exp - now < 60;
  } catch {
    return true;
  }
};

// ✅ refreshToken يُقرأ تلقائياً من httpOnly cookie عبر withCredentials: true
// لا حاجة لإرسال أي body — السيرفر يقرأ الكوكي بنفسه
const refreshTokens = async (): Promise<string> => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );

  const { accessToken: newAccessToken } = response.data.data;
  localStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
};

// ✅ Redirect مركزي في مكان واحد فقط
const handleAuthFailure = () => {
  localStorage.removeItem('accessToken');
  if (typeof window !== 'undefined' && window.location.pathname !== '/Login') {
    window.location.href = '/Login';
  }
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ✅ يسمح بإرسال/استقبال httpOnly cookies
});

// ─── Request Interceptor ───────────────────────────────────────────
apiClient.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config;

  let token = localStorage.getItem('accessToken');

  if (token && (isTokenExpired(token) || isTokenExpiringSoon(token))) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        token = await refreshTokens();
        processQueue(null, token);
      } catch (error) {
        processQueue(error, null);
        handleAuthFailure();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else {
      // ✅ انتظر الـ refresh الجاري بدل ما تبدأ واحد جديد
      try {
        token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response Interceptor ──────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: RetryConfig = error.config;

    // ✅ تجاهل أخطاء الـ refresh نفسه لتفادي infinite loop
    if (originalRequest?.url?.includes('/auth/refresh')) {
      handleAuthFailure();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const newToken = await refreshTokens();
        processQueue(null, newToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);