import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { resetPassword } from '@/lib/auth';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/**
 * يعيد تعيين كلمة المرور باستخدام الـ token القادم من رابط البريد.
 * يُستخدم في صفحة /reset-password.
 */
export const useResetPassword = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, ResetPasswordPayload>({
    mutationFn: ({ token, newPassword }) => resetPassword(token, newPassword),
  });
};