import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { forgotPassword } from '@/lib/auth';

interface ApiErrorResponse {
  message: string;
  errors?: string[];
}

/**
 * يرسل طلب "نسيت كلمة المرور" بالإيميل، يستخدم في صفحة /forgot-password.
 */
export const useForgotPassword = () => {
  return useMutation<unknown, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (email: string) => forgotPassword(email),
  });
};