// ============================================================
// src/components/organisms/user/PaymentsPage.tsx
// صفحة المدفوعات — /payments
// مميزات: إحصاءات، سجل، بطاقات المحفوظة، تصدير
// ============================================================
"use client";

import { Download, CreditCard } from "lucide-react";
import { usePaymentHistory, usePaymentStats } from "@/hooks/user/useUserQueries";
import { PaymentStatusBadge } from "@/components/molecules/user/BookingStatusBadge";
import { SavedCards } from "@/components/molecules/user/SavedCards";
import { StatsCardsSkeleton, PaymentRowSkeleton } from "@/components/atoms/skeletons";

export function PaymentsPage() {
  const { data: stats, isLoading: statsLoading } = usePaymentStats();
  const { data: history, isLoading: histLoading } = usePaymentHistory();

  const statCards = stats
    ? [
        { label: "إجمالي المدفوعات", value: `${stats.totalSpent.toLocaleString("ar-SA")} ر.س` },
        { label: "حجوزات مكتملة",    value: stats.completedBookings },
        { label: "إجمالي الوفر",      value: `${stats.totalSaved.toLocaleString("ar-SA")} ر.س`, green: true },
        { label: "متوسط الحجز",       value: `${stats.averageBooking.toLocaleString("ar-SA")} ر.س` },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المدفوعات</h1>

      {/* إحصاءات */}
      {statsLoading ? (
        <StatsCardsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${
                (s as any).green
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-900 dark:text-white"
              }`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* سجل المعاملات */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                آخر المعاملات
              </h2>
              <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 
                                 border border-blue-200 dark:border-blue-800 px-3 h-7 rounded-lg transition-colors">
                <Download className="w-3.5 h-3.5" />
                تصدير PDF
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800 px-5">
              {histLoading
                ? [1, 2, 3].map((i) => <PaymentRowSkeleton key={i} />)
                : !history?.length
                ? (
                  <div className="text-center py-10">
                    <CreditCard className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">لا توجد مدفوعات بعد.</p>
                  </div>
                )
                : history.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {p.car.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString("ar-SA")}
                          {p.last4 && ` · ${p.method} ••${p.last4}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {p.amount.toLocaleString("ar-SA")} ر.س
                      </p>
                      <PaymentStatusBadge status={p.status} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* بطاقات الدفع المحفوظة */}
        <div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              بطاقاتي المحفوظة
            </h2>
            <SavedCards
              mode="manage"
              onAddNew={() => window.alert("سيتم توجيهك لبوابة الدفع لإضافة بطاقة")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}