"use client";

import { useEffect, useState, useCallback } from "react";
import EmptyState from "@/components/molecules/Emptystate";
import ConfirmDialog from "@/components/molecules/Confirmdialog";
import StatusBadge from "@/components/molecules/Statusbadge";
import CouponModal, { type CouponModalMode } from "@/components/organisms/admin/Modal/CouponModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  type Coupon,
  type CouponFormData,
} from "@/utils/coupons-service";
import { Search, Loader2, TicketPercent, Pencil, Trash2, Plus } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<CouponModalMode>(null);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCoupons();
      setCoupons(data ?? []);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب الكوبونات. تأكد من اتصال الخادم.");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data: CouponFormData) => {
    setSaving(true);
    try {
      if (modalMode === "add") {
        const created = await createCoupon(data);
        setCoupons((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && activeCoupon) {
        const updated = await updateCoupon(activeCoupon.id, data);
        setCoupons((prev) =>
          prev.map((c) => (c.id === activeCoupon.id ? updated : c))
        );
      }
      setModalMode(null);
      setActiveCoupon(null);
    } catch (err) {
      console.error(err);
      alert("فشل حفظ الكوبون.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCoupon(deleteTarget.id);
      setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل حذف الكوبون.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة الكوبونات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              إنشاء وإدارة أكواد الخصم.
            </Text>
          </div>
          <button
            onClick={() => setModalMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={18} />
            كوبون جديد
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بكود الخصم..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
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
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<TicketPercent size={28} />}
            title="لا توجد كوبونات"
            description="ابدأ بإنشاء كوبون خصم جديد."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((coupon) => {
              const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
              const isExhausted = !!coupon.maxUses && coupon.usedCount >= coupon.maxUses;
              const effectivelyActive = coupon.isActive && !isExpired && !isExhausted;

              return (
                <div
                  key={coupon.id}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TicketPercent size={18} className="text-orange-500" />
                      <p className="font-mono font-bold text-gray-900 dark:text-white tracking-wide">
                        {coupon.code}
                      </p>
                    </div>
                    <StatusBadge
                      label={effectivelyActive ? "نشط" : isExpired ? "منتهي" : isExhausted ? "مستنفد" : "غير نشط"}
                      color={effectivelyActive ? "green" : "gray"}
                    />
                  </div>

                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `$${coupon.value}`}
                  </p>

                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex justify-between">
                      <span>الاستخدام</span>
                      <span>
                        {coupon.usedCount} / {coupon.maxUses ?? "∞"}
                      </span>
                    </div>
                    {coupon.minBookingAmount && (
                      <div className="flex justify-between">
                        <span>أقل مبلغ</span>
                        <span>${coupon.minBookingAmount}</span>
                      </div>
                    )}
                    {coupon.expiresAt && (
                      <div className="flex justify-between">
                        <span>ينتهي في</span>
                        <span dir="ltr">{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => {
                        setActiveCoupon(coupon);
                        setModalMode("edit");
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Pencil size={14} />
                      تعديل
                    </button>
                    <button
                      onClick={() => setDeleteTarget(coupon)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 size={14} />
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CouponModal
        mode={modalMode}
        coupon={activeCoupon}
        isLoading={saving}
        onClose={() => {
          setModalMode(null);
          setActiveCoupon(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الكوبون"
        description={`هل أنت متأكد من حذف الكوبون "${deleteTarget?.code}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}