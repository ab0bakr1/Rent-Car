// ============================================================
// src/components/organisms/user/BookingDetailPage.tsx
// صفحة تفاصيل الحجز — /bookings/[id]
// مميزات: Timeline، نموذج تقييم بالنجوم، معلومات الدفع
// ============================================================
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Circle, Star, Download, ChevronRight } from "lucide-react";
import {
  useBooking,
  useCreateReview,
} from "@/hooks/user/useUserQueries";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/molecules/user/BookingStatusBadge";
import { cn } from "@/lib/cn";

// ─── Timeline ────────────────────────────────────────────────
interface TimelineStep {
  label: string;
  time?: string;
  state: "done" | "active" | "pending";
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700 space-y-5 me-2">
      {steps.map((step, i) => (
        <li key={i} className="ms-5">
          <span
            className={cn(
              "absolute -start-2.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900",
              step.state === "done"
                ? "bg-green-500"
                : step.state === "active"
                ? "bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            )}
          >
            {step.state === "done" ? (
              <CheckCircle2 className="w-3 h-3 text-white" />
            ) : step.state === "active" ? (
              <Clock className="w-3 h-3 text-white animate-pulse" />
            ) : (
              <Circle className="w-3 h-3 text-gray-400" />
            )}
          </span>
          <p className={cn(
            "text-sm font-medium",
            step.state === "pending" ? "text-gray-400" : "text-gray-800 dark:text-white"
          )}>
            {step.label}
          </p>
          {step.time && (
            <time className="text-xs text-gray-400">{step.time}</time>
          )}
        </li>
      ))}
    </ol>
  );
}

// ─── Star Rating Input ────────────────────────────────────────
function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1" role="group" aria-label="التقييم">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} نجوم`}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "w-7 h-7 transition-colors",
              (hover || value) >= s
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            )}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────
export function BookingDetailPage({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openReview = searchParams.get("review") === "1";

  const { data: booking, isLoading } = useBooking(bookingId);
  const createReview = useCreateReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  async function handleReview() {
    if (!rating || !bookingId) return;
    await createReview.mutateAsync({ bookingId, rating, comment });
    setReviewSubmitted(true);
  }

  if (isLoading || !booking) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  // بناء خطوات الـ Timeline بناءً على الحالة
  const timelineSteps: TimelineStep[] = [
    {
      label: "تم إنشاء الحجز",
      time: new Date(booking.createdAt).toLocaleString("ar-SA"),
      state: "done",
    },
    {
      label: "تم تأكيد الحجز",
      state: ["confirmed", "active", "completed"].includes(booking.status) ? "done" : "pending",
    },
    {
      label: "السيارة قيد الاستخدام",
      state:
        booking.status === "active"
          ? "active"
          : booking.status === "completed"
          ? "done"
          : "pending",
    },
    {
      label: "إعادة السيارة",
      time: new Date(booking.endDate).toLocaleDateString("ar-SA"),
      state: booking.status === "completed" ? "done" : "pending",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* رجوع */}
      <button
        onClick={() => router.push("/bookings/my")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
        حجوزاتي
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          تفاصيل الحجز
        </h1>
        <span className="text-xs text-gray-400 font-mono">#{bookingId.slice(-8).toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ─── العمود الأيسر ─── */}
        <div className="space-y-5">
          {/* معلومات الحجز */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                السيارة
              </h2>
              <BookingStatusBadge status={booking.status} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-10 bg-blue-50 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{booking.car.name}</p>
                <p className="text-xs text-gray-500">{booking.car.brand}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["تاريخ الاستلام", new Date(booking.startDate).toLocaleDateString("ar-SA")],
                ["تاريخ التسليم", new Date(booking.endDate).toLocaleDateString("ar-SA")],
                ["موقع الاستلام", booking.pickupLocation],
                ["موقع التسليم", booking.returnLocation],
                ["عدد الأيام", `${booking.totalDays} أيام`],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-700 dark:text-gray-200">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              مراحل الحجز
            </h2>
            <Timeline steps={timelineSteps} />
          </div>

          {/* نموذج التقييم — يظهر عند إتمام الحجز */}
          {booking.status === "completed" && !reviewSubmitted && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-5">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                قيّم تجربتك
              </h2>
              <StarRatingInput value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="شاركنا تجربتك مع السيارة..."
                rows={3}
                className="mt-3 w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 
                           bg-white dark:bg-gray-800 text-sm resize-none 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleReview}
                disabled={rating === 0 || createReview.isPending}
                className="mt-3 w-full h-10 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 
                           text-white font-medium text-sm rounded-xl transition-colors"
              >
                {createReview.isPending ? "جارٍ الإرسال..." : "إرسال التقييم"}
              </button>
            </div>
          )}
          {reviewSubmitted && (
            <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800 p-4 flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              شكراً! تم إرسال تقييمك بنجاح.
            </div>
          )}
        </div>

        {/* ─── العمود الأيمن: الدفع ─── */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
              معلومات الدفع
            </h2>

            {/* تفاصيل المبلغ */}
            <div className="space-y-3 text-sm">
              {[
                ["سعر اليوم", `${booking.pricePerDay.toLocaleString("ar-SA")} ر.س`],
                ["عدد الأيام", `${booking.totalDays}`],
                ["الإجمالي", `${booking.subtotal.toLocaleString("ar-SA")} ر.س`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{label}</span>
                  <span>{val}</span>
                </div>
              ))}
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>خصم الكوبون</span>
                  <span>- {booking.discountAmount.toLocaleString("ar-SA")} ر.س</span>
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                <span>الإجمالي</span>
                <span>{booking.totalAmount.toLocaleString("ar-SA")} ر.س</span>
              </div>
            </div>

            {/* حالة الدفع */}
            <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">طريقة الدفع</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {booking.paymentMethod ?? "—"}
                  {booking.paymentLast4 && (
                    <span className="text-gray-400"> •••• {booking.paymentLast4}</span>
                  )}
                </p>
              </div>
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>

            {/* تحميل الإيصال */}
            <button className="mt-4 w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-colors">
              <Download className="w-4 h-4" />
              تحميل الإيصال PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}