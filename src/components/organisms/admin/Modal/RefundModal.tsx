"use client";

import { useState } from "react";
import type { Payment } from "@/utils/payments-service";

interface Props {
  payment: Payment | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (amount: number, reason: string) => Promise<void>;
}

export default function RefundModal({ payment, isLoading, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");

  if (!payment) return null;

  const maxRefundable = payment.amount - (payment.refundedAmount ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || numericAmount > maxRefundable) return;
    await onSubmit(numericAmount, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            استرجاع مبلغ — #{payment.booking.bookingNumber}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-5 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500 dark:text-gray-400">إجمالي الدفعة</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${payment.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">القابل للاسترجاع</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              ${maxRefundable.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              المبلغ المراد استرجاعه ($)
            </label>
            <input
              type="number"
              min={1}
              max={maxRefundable}
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`حتى ${maxRefundable}`}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              السبب <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="مثال: إلغاء من قبل العميل"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              تأكيد الاسترجاع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}