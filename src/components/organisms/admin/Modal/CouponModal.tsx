"use client";

import { useEffect, useState } from "react";
import type { Coupon, CouponFormData, CouponType } from "@/utils/coupons-service";

export type CouponModalMode = "add" | "edit" | null;

interface Props {
  mode: CouponModalMode;
  coupon?: Coupon | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => Promise<void>;
}

const EMPTY_FORM: CouponFormData = {
  code: "",
  type: "PERCENTAGE",
  value: 0,
  maxUses: null,
  minBookingAmount: null,
  expiresAt: null,
  isActive: true,
};

const toDateInput = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");

export default function CouponModal({ mode, coupon, isLoading, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CouponFormData>(EMPTY_FORM);

  useEffect(() => {
    if (mode === "edit" && coupon) {
      setForm({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        maxUses: coupon.maxUses ?? null,
        minBookingAmount: coupon.minBookingAmount ?? null,
        expiresAt: coupon.expiresAt ?? null,
        isActive: coupon.isActive,
      });
    } else if (mode === "add") {
      setForm(EMPTY_FORM);
    }
  }, [mode, coupon]);

  if (!mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "إنشاء كوبون جديد" : "تعديل الكوبون"}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              كود الخصم
            </label>
            <input
              required
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER50"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                نوع الخصم
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CouponType }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="PERCENTAGE">نسبة %</option>
                <option value="FIXED">مبلغ ثابت</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                القيمة
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.value}
                onChange={(e) => setForm((p) => ({ ...p, value: Number(e.target.value) }))}
                placeholder={form.type === "PERCENTAGE" ? "20" : "50"}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحد الأقصى للاستخدام <span className="text-gray-400 font-normal">(اختياري)</span>
              </label>
              <input
                type="number"
                min={1}
                value={form.maxUses ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxUses: e.target.value ? Number(e.target.value) : null }))
                }
                placeholder="100"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                أقل مبلغ للحجز <span className="text-gray-400 font-normal">(اختياري)</span>
              </label>
              <input
                type="number"
                min={0}
                value={form.minBookingAmount ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    minBookingAmount: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="100"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              تاريخ الانتهاء <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="date"
              value={toDateInput(form.expiresAt)}
              onChange={(e) =>
                setForm((p) => ({ ...p, expiresAt: e.target.value || null }))
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">الكوبون نشط</span>
          </label>

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
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {mode === "add" ? "إنشاء" : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}