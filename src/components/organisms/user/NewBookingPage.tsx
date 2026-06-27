// ============================================================
// src/components/organisms/user/NewBookingPage.tsx
// صفحة الحجز الجديد — /bookings/new
// مميزات: One-click pay، كوبون، ملخص السعر التلقائي
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Tag, CheckCircle2, AlertCircle, CreditCard } from "lucide-react";
import { useCar, useLocations, useCreateBooking, useValidateCoupon } from "@/hooks/user/useUserQueries";
import { SavedCards } from "@/components/molecules/user/SavedCards";
import { cn } from "@/lib/cn";
import type { SavedCard } from "@/types/user.types";

// ─── حساب عدد الأيام ─────────────────────────────────────────
function calcDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function NewBookingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const carId = params.get("carId") ?? "";

  // بيانات السيارة والمواقع
  const { data: car } = useCar(carId);
  const { data: locations } = useLocations();

  // State النموذج
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const [pickupId, setPickupId]     = useState("");
  const [returnId, setReturnId]     = useState("");
  const [coupon, setCoupon]         = useState("");
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);

  // Coupon validation
  const validateCoupon = useValidateCoupon();
  const couponResult = validateCoupon.data;

  // Booking mutation
  const createBooking = useCreateBooking();

  // حساب الأسعار
  const days      = calcDays(startDate, endDate);
  const subtotal  = (car?.pricePerDay ?? 0) * days;
  const discount  = couponResult?.valid
    ? (subtotal * (couponResult.discountPercent ?? 0)) / 100
    : 0;
  const total = subtotal - discount;

  // تعيين الـ pickup/return تلقائياً عند تحميل المواقع
  useEffect(() => {
    if (locations?.length && !pickupId) {
      setPickupId(locations[0].id);
      setReturnId(locations[0].id);
    }
  }, [locations, pickupId]);

  function handleApplyCoupon() {
    if (!coupon.trim() || !carId) return;
    validateCoupon.mutate({ code: coupon.trim(), carId });
  }

  async function handleSubmit() {
    if (!carId || !startDate || !endDate || !pickupId || !returnId) return;
    try {
      const booking = await createBooking.mutateAsync({
        carId,
        startDate,
        endDate,
        pickupLocationId: pickupId,
        returnLocationId: returnId,
        couponCode: couponResult?.valid ? coupon : undefined,
        savedCardId: selectedCard?.id,
      });
      router.push(`/bookings/${booking.id}`);
    } catch {
      // الخطأ يُعالج في React Query
    }
  }

  const isValid = !!carId && !!startDate && !!endDate && !!pickupId && !!returnId && days > 0;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">حجز جديد</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── النموذج ─── */}
        <div className="lg:col-span-3 space-y-5">

          {/* السيارة المختارة */}
          {car && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4">
              <div className="w-16 h-12 bg-blue-50 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{car.name}</p>
                <p className="text-sm text-gray-500">{car.brand} · {car.pricePerDay.toLocaleString("ar-SA")} ر.س/يوم</p>
              </div>
            </div>
          )}

          {/* التواريخ */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              📅 مدة الحجز
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">تاريخ الاستلام</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate && e.target.value >= endDate) setEndDate("");
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">تاريخ التسليم</label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {days > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                ✓ مدة الحجز: {days} {days === 1 ? "يوم" : "أيام"}
              </p>
            )}
          </div>

          {/* المواقع */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              مواقع الاستلام والتسليم
            </h2>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">موقع الاستلام</label>
              <select
                value={pickupId}
                onChange={(e) => setPickupId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations?.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} — {l.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">موقع التسليم</label>
              <select
                value={returnId}
                onChange={(e) => setReturnId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations?.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} — {l.city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* كوبون الخصم */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-400" />
              كوبون الخصم
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل كود الخصم"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="flex-1 h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-sm uppercase tracking-widest
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={validateCoupon.isPending || !coupon.trim()}
                className="px-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 
                           text-sm font-medium text-gray-700 dark:text-gray-200
                           hover:border-blue-400 transition-colors disabled:opacity-50"
              >
                {validateCoupon.isPending ? "..." : "تطبيق"}
              </button>
            </div>
            {/* نتيجة الكوبون */}
            {couponResult && (
              <div
                className={cn(
                  "mt-2 flex items-center gap-2 text-sm px-3 py-2 rounded-xl",
                  couponResult.valid
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                )}
              >
                {couponResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {couponResult.valid
                  ? `تم تطبيق خصم ${couponResult.discountPercent}%`
                  : couponResult.message ?? "الكوبون غير صالح"}
              </div>
            )}
          </div>

          {/* طريقة الدفع — One-click pay */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              طريقة الدفع
            </h2>

            {/* تبويبات */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUseNewCard(false)}
                className={cn(
                  "flex-1 h-9 rounded-xl text-sm font-medium transition-all",
                  !useNewCard
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                )}
              >
                بطاقاتي المحفوظة
              </button>
              <button
                onClick={() => { setUseNewCard(true); setSelectedCard(null); }}
                className={cn(
                  "flex-1 h-9 rounded-xl text-sm font-medium transition-all",
                  useNewCard
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                )}
              >
                بطاقة جديدة
              </button>
            </div>

            {!useNewCard ? (
              <SavedCards
                mode="select"
                selectedCardId={selectedCard?.id}
                onSelect={setSelectedCard}
                onAddNew={() => setUseNewCard(true)}
              />
            ) : (
              <div className="text-center py-6 text-sm text-gray-400">
                سيتم تحويلك لبوابة الدفع عند تأكيد الحجز
              </div>
            )}
          </div>
        </div>

        {/* ─── ملخص السعر ─── */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              ملخص الحجز
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>سعر اليوم</span>
                <span>{(car?.pricePerDay ?? 0).toLocaleString("ar-SA")} ر.س</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>عدد الأيام</span>
                <span>{days || "—"}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>الإجمالي</span>
                <span>{subtotal.toLocaleString("ar-SA")} ر.س</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>خصم الكوبون ({couponResult?.discountPercent}%)</span>
                  <span>- {discount.toLocaleString("ar-SA")} ر.س</span>
                </div>
              )}
              {selectedCard && (
                <div className="flex justify-between text-blue-600 dark:text-blue-400 text-xs">
                  <span>سيُخصم من</span>
                  <span>•••• {selectedCard.last4}</span>
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>الإجمالي النهائي</span>
                <span>{total.toLocaleString("ar-SA")} ر.س</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid || createBooking.isPending}
              className="mt-5 w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 
                         disabled:cursor-not-allowed text-white font-semibold rounded-xl 
                         transition-colors flex items-center justify-center gap-2"
            >
              {createBooking.isPending ? (
                <span className="animate-spin text-lg">⏳</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  {selectedCard ? "دفع بنقرة واحدة" : "تأكيد الحجز والدفع"}
                </>
              )}
            </button>

            {createBooking.isError && (
              <p className="mt-2 text-xs text-red-500 text-center">
                حدث خطأ. يرجى المحاولة مجدداً.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}