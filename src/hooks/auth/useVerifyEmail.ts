import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { verifyEmail, resendVerification } from '@/lib/auth';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

/**
 * يستدعي endpoint تأكيد الإيميل بالـ token القادم من رابط البريد.
 * يُستخدم عادة تلقائياً عند تحميل صفحة /verify-email عبر useEffect.
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
};

/**
 * يعيد إرسال رابط/كود التحقق إلى إيميل المستخدم.
 */
export const useResendVerification = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (email: string) => resendVerification(email),
  });
};