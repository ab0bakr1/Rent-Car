'use client';

import { useState } from 'react';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }
    if (!validateEmail(email)) {
      setError('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    forgotPasswordMutation.mutate(email);
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 my-40 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          تحقق من بريدك الإلكتروني
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          أرسلنا رابط إعادة تعيين كلمة المرور إلى{' '}
          <span className="font-medium text-gray-700 dark:text-gray-200">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 my-40 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
        نسيت كلمة المرور؟
      </h2>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>

        {forgotPasswordMutation.isError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            تعذر إرسال الطلب، تأكد من البريد وحاول مرة أخرى.
          </p>
        )}

        <button
          type="submit"
          disabled={forgotPasswordMutation.isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {forgotPasswordMutation.isPending ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
        </button>
      </form>
    </div>
  );
};