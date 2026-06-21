'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPassword } from '@/hooks/auth/useResetPassword';

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const resetPasswordMutation = useResetPassword();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !validate()) return;

    resetPasswordMutation.mutate(
      { token, newPassword },
      {
        onSuccess: () => {
          setTimeout(() => router.push('/login'), 2000);
        },
      }
    );
  };

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md mt-40 mb-10 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          ✕
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          رابط غير صالح
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          الرابط مفقود أو غير صحيح، يرجى طلب رابط جديد من صفحة نسيت كلمة المرور.
        </p>
      </div>
    );
  }

  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="mx-auto w-full max-w-md mt-40 mb-10 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          تم تغيير كلمة المرور بنجاح
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          سيتم تحويلك لصفحة تسجيل الدخول...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md mt-40 mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        إعادة تعيين كلمة المرور
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        أدخل كلمة مرور جديدة لحسابك.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            كلمة المرور الجديدة
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.newPassword && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {resetPasswordMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            تعذر إعادة تعيين كلمة المرور، الرابط قد يكون منتهي الصلاحية.
          </p>
        )}

        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {resetPasswordMutation.isPending ? 'جاري الحفظ...' : 'تعيين كلمة المرور الجديدة'}
        </button>
      </form>
    </div>
  );
};