import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { changePassword } from '@/lib/auth';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/**
 * يغيّر كلمة المرور للمستخدم المسجّل دخوله حالياً.
 * يُستخدم في صفحة /change-password (صفحة محمية).
 */
export const useChangePassword = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, ChangePasswordPayload>({
    mutationFn: ({ oldPassword, newPassword }) =>
      changePassword(oldPassword, newPassword),
  });
};