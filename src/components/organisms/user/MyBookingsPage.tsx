// ============================================================
// src/components/organisms/user/MyBookingsPage.tsx
// صفحة حجوزاتي — /bookings/my
// ============================================================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMyBookings, useCancelBooking } from "@/hooks/user/useUserQueries";
import { BookingsListSkeleton } from "@/components/atoms/skeletons";
import { BookingStatusBadge } from "@/components/molecules/user/BookingStatusBadge";
import type { BookingStatus } from "@/types/user.types";
import { cn } from "@/lib/cn";
import { Calendar, MapPin } from "lucide-react";

const TABS: { label: string; value: string }[] = [
  { label: "الكل", value: "" },
  { label: "نشطة", value: "active" },
  { label: "منتهية", value: "completed" },
  { label: "ملغاة", value: "cancelled" },
];

export function MyBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useMyBookings(activeTab || undefined);
  const cancelBooking = useCancelBooking();

  async function handleCancel(id: string) {
    if (!confirm("هل أنت متأكد من إلغاء هذا الحجز؟")) return;
    setCancelId(id);
    try {
      await cancelBooking.mutateAsync(id);
    } finally {
      setCancelId(null);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">حجوزاتي</h1>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={cn(
              "px-4 h-9 rounded-xl text-sm font-medium transition-all",
              activeTab === t.value
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* قائمة الحجوزات */}
      {isLoading ? (
        <BookingsListSkeleton />
      ) : !bookings?.length ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500">لا توجد حجوزات.</p>
          <button
            onClick={() => router.push("/cars")}
            className="mt-3 text-sm text-blue-600 underline"
          >
            تصفح السيارات
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {bookings.map((b) => (
            <div key={b.id} className="flex items-center gap-4 p-4">
              {/* أيقونة السيارة */}
              <div className="w-14 h-12 bg-blue-50 dark:bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
                </svg>
              </div>

              {/* معلومات */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{b.car.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(b.startDate).toLocaleDateString("ar-SA")} —{" "}
                  {new Date(b.endDate).toLocaleDateString("ar-SA")}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {b.pickupLocation}
                </p>
              </div>

              {/* الحالة والأزرار */}
              <div className="flex flex-col items-end gap-2">
                <BookingStatusBadge status={b.status} size="sm" />
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/bookings/${b.id}`)}
                    className="text-xs px-3 h-7 rounded-lg border border-gray-200 dark:border-gray-700 
                               text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-colors"
                  >
                    التفاصيل
                  </button>
                  {(b.status === "confirmed" || b.status === "pending") && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelId === b.id}
                      className="text-xs px-3 h-7 rounded-lg border border-red-200 dark:border-red-900 
                                 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 
                                 transition-colors disabled:opacity-50"
                    >
                      {cancelId === b.id ? "..." : "إلغاء"}
                    </button>
                  )}
                  {b.status === "completed" && (
                    <button
                      onClick={() => router.push(`/bookings/${b.id}?review=1`)}
                      className="text-xs px-3 h-7 rounded-lg border border-yellow-200 dark:border-yellow-900 
                                 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors"
                    >
                      ⭐ قيّم
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}