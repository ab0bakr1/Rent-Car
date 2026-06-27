"use client";

import { useEffect, useState, useCallback } from "react";
import StatusBadge from "@/components/molecules/Statusbadge";
import Pagination from "@/components/molecules/Pagination";
import EmptyState from "@/components/molecules/Emptystate";
import RefundModal from "@/components/organisms/admin/Modal/RefundModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getPayments,
  refundPayment,
  type Payment,
  type PaymentStatus,
} from "@/utils/payments-service";
import { Search, Loader2, Banknote, User, Undo2 } from "lucide-react";

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; color: "green" | "yellow" | "red" | "blue" | "gray" | "purple" }
> = {
  PENDING: { label: "معلّقة", color: "yellow" },
  PAID: { label: "مدفوعة", color: "green" },
  FAILED: { label: "فاشلة", color: "red" },
  REFUNDED: { label: "مُسترجعة", color: "gray" },
  PARTIALLY_REFUNDED: { label: "استرجاع جزئي", color: "purple" },
};

const METHOD_LABELS: Record<string, string> = {
  CARD: "بطاقة",
  CASH: "نقداً",
  PAY_LATER: "دفع لاحق",
  BANK_TRANSFER: "حوالة بنكية",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);
  const [refunding, setRefunding] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPayments({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });
      setPayments(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب المدفوعات. تأكد من اتصال الخادم.");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRefund = async (amount: number, reason: string) => {
    if (!refundTarget) return;
    setRefunding(true);
    try {
      const updated = await refundPayment(refundTarget.id, { amount, reason });
      setPayments((prev) =>
        prev.map((p) => (p.id === refundTarget.id ? { ...p, ...updated } : p))
      );
      setRefundTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل تنفيذ عملية الاسترجاع.");
    } finally {
      setRefunding(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة المدفوعات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              عرض المدفوعات وتنفيذ عمليات الاسترجاع.
            </Text>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="بحث برقم الحجز أو اسم العميل..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as PaymentStatus | "");
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">كل الحالات</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 font-medium text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={<Banknote size={28} />}
            title="لا توجد مدفوعات"
            description="لم يتم العثور على مدفوعات مطابقة لبحثك."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payments.map((payment) => {
              const canRefund =
                payment.status === "PAID" || payment.status === "PARTIALLY_REFUNDED";
              return (
                <div
                  key={payment.id}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">حجز رقم</p>
                      <p className="font-bold text-gray-900 dark:text-white">
                        #{payment.booking.bookingNumber}
                      </p>
                    </div>
                    <StatusBadge
                      label={STATUS_CONFIG[payment.status]?.label ?? payment.status}
                      color={STATUS_CONFIG[payment.status]?.color ?? "gray"}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User size={15} className="shrink-0" />
                      <span className="truncate">
                        {payment.user.firstName} {payment.user.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">طريقة الدفع</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {METHOD_LABELS[payment.method] ?? payment.method}
                      </span>
                    </div>
                    {!!payment.refundedAmount && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">تم استرجاعه</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          ${payment.refundedAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => setRefundTarget(payment)}
                      disabled={!canRefund}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-40 disabled:hover:bg-red-50 transition-colors"
                    >
                      <Undo2 size={14} />
                      استرجاع
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <RefundModal
        payment={refundTarget}
        isLoading={refunding}
        onClose={() => setRefundTarget(null)}
        onSubmit={handleRefund}
      />
    </>
  );
}