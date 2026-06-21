'use client';

import { useState } from 'react';
import { useChangePassword } from '@/hooks/auth/useChangePassword';

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const changePasswordMutation = useChangePassword();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!oldPassword) {
      newErrors.oldPassword = 'كلمة المرور الحالية مطلوبة';
    }

    if (!newPassword) {
      newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
    } else if (newPassword === oldPassword) {
      newErrors.newPassword = 'كلمة المرور الجديدة يجب أن تختلف عن الحالية';
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
    if (!validate()) return;

    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        },
      }
    );
  };

  return (
    <div className="mx-auto w-full max-w-md mt-40 mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        تغيير كلمة المرور
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        أدخل كلمة مرورك الحالية ثم كلمة المرور الجديدة.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            كلمة المرور الحالية
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.oldPassword && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.oldPassword}</p>
          )}
        </div>

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
            تأكيد كلمة المرور الجديدة
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

        {changePasswordMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            تعذر تغيير كلمة المرور، تأكد من كلمة المرور الحالية.
          </p>
        )}

        {changePasswordMutation.isSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400">
            تم تغيير كلمة المرور بنجاح.
          </p>
        )}

        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {changePasswordMutation.isPending ? 'جاري الحفظ...' : 'حفظ كلمة المرور الجديدة'}
        </button>
      </form>
    </div>
  );
};