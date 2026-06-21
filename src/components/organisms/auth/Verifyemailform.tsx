'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyEmail, useResendVerification } from '@/hooks/auth/useVerifyEmail';

type Status = 'loading' | 'success' | 'error' | 'no-token';

export const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [resendEmail, setResendEmail] = useState('');

  const verifyEmailMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    verifyEmailMutation.mutate(token, {
      onSuccess: () => setStatus('success'),
      onError: () => setStatus('error'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    resendMutation.mutate(resendEmail);
  };

  return (
    <div className="mx-auto w-full max-w-md mt-40 mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">
            جاري تأكيد بريدك الإلكتروني...
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            ✓
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            تم تأكيد بريدك الإلكتروني بنجاح
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            يمكنك الآن تسجيل الدخول إلى حسابك.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            الذهاب لتسجيل الدخول
          </button>
        </div>
      )}

      {(status === 'error' || status === 'no-token') && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            ✕
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {status === 'no-token'
              ? 'رابط التأكيد غير صالح'
              : 'فشل تأكيد البريد الإلكتروني'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            قد يكون الرابط منتهي الصلاحية. أدخل بريدك لإعادة إرسال رابط التأكيد.
          </p>

          <form onSubmit={handleResend} className="w-full space-y-3">
            <input
              type="email"
              required
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={resendMutation.isPending}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {resendMutation.isPending ? 'جاري الإرسال...' : 'إعادة إرسال رابط التأكيد'}
            </button>

            {resendMutation.isSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">
                تم إرسال رابط جديد، تحقق من بريدك.
              </p>
            )}
            {resendMutation.isError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                حدث خطأ، حاول مرة أخرى.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};