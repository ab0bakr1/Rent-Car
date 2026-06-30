// ============================================================
// src/lib/api-client.ts  ← استبدل الملف الموجود بهذا
//
// المشكلة: /users/me يرجع 403 رغم تسجيل الدخول
// السبب:   الـ interceptor لا يجد التوكن في المكان الصحيح
//
// هذا الـ client يبحث عن التوكن في كل الأماكن المحتملة:
//   1. localStorage  (js-cookie أو zustand persist)
//   2. sessionStorage
//   3. Cookies (الـ js-readable ليست httpOnly)
//   4. window.__authToken  (إذا كان المشروع يخزّنه في-memory)
// ============================================================

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

// ─── قراءة الـ baseURL من الـ env ────────────────────────────
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

// ─── أسماء محتملة لمفتاح التوكن في الـ storage ───────────────
const TOKEN_KEYS = [
  "access_token",
  "accessToken",
  "token",
  "jwt",
  "authToken",
  "auth_token",
  "userToken",
  "user_token",
  "rentcar_token",    // اسم المشروع
  "rentCarToken",
];

// ─── قراءة التوكن من أي مكان محتمل ──────────────────────────
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. localStorage
  for (const key of TOKEN_KEYS) {
    const val = localStorage.getItem(key);
    if (val) return val;
  }

  // 2. sessionStorage
  for (const key of TOKEN_KEYS) {
    const val = sessionStorage.getItem(key);
    if (val) return val;
  }

  // 3. Cookies (js-readable فقط)
  if (document.cookie) {
    const cookies = document.cookie.split("; ");
    for (const key of TOKEN_KEYS) {
      const found = cookies.find((c) => c.startsWith(`${key}=`));
      if (found) return found.split("=")[1];
    }
  }

  // 4. zustand persist — قد يكون مخزّناً داخل JSON object
  for (const key of ["auth-storage", "user-storage", "auth", "userStore", "authStore"]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      // zustand persist: { state: { token: "..." } }
      const token =
        parsed?.state?.token         ||
        parsed?.state?.accessToken   ||
        parsed?.state?.access_token  ||
        parsed?.token                ||
        parsed?.accessToken;
      if (token) return token;
    } catch {
      // ليس JSON صالح
    }
  }

  // 5. in-memory على window (بعض المشاريع تخزّنه هكذا)
  const w = window as any;
  return w.__authToken ?? w.__accessToken ?? w.__token ?? null;
}

// ─── إنشاء الـ instance ───────────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // يرسل الـ httpOnly cookies تلقائياً (refreshToken)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000, // 15 ثانية
});

// ─── Request Interceptor ──────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    } else if (process.env.NODE_ENV === "development") {
      console.warn(
        `[api-client] ⚠️ لا يوجد access token للطلب: ${config.url}\n` +
        `localStorage keys: ${Object.keys(localStorage).join(", ")}`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // ─── 401: حاول الـ token refresh ───────────────────────
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // طلبات متزامنة — انتظر انتهاء الـ refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // جرب مسارات الـ refresh المحتملة
        const refreshEndpoints = [
          "/auth/refresh",
          "/auth/refresh-token",
          "/auth/token/refresh",
        ];

        let newToken: string | null = null;

        for (const endpoint of refreshEndpoints) {
          try {
            const { data } = await axios.post(
              `${BASE_URL}${endpoint}`,
              {},
              { withCredentials: true } // يرسل الـ refresh cookie
            );
            newToken =
              data?.access_token  ??
              data?.accessToken   ??
              data?.token         ??
              null;
            if (newToken) break;
          } catch {
            continue;
          }
        }

        if (!newToken) throw new Error("Refresh failed");

        // خزّن التوكن الجديد في نفس مكان القديم
        const tokenKey = TOKEN_KEYS.find((k) => localStorage.getItem(k)) ?? "access_token";
        localStorage.setItem(tokenKey, newToken);

        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // الـ refresh فشل → أرسل المستخدم للـ Login
        if (typeof window !== "undefined") {
          window.location.href = `/Login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ─── 403: مسجّل دخول لكن ليس لديه صلاحية ──────────────
    if (status === 403) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[api-client] 🚫 403 Forbidden: ${originalRequest.url}\n` +
          `تحقق من صلاحيات الـ role في الـ backend`
        );
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;