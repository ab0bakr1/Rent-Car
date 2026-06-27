// ============================================================
// src/app/(user)/bookings/[id]/page.tsx
// Route: /bookings/[id] — تفاصيل الحجز
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingDetailPage } from "@/components/organisms/user/BookingDetailPage";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `تفاصيل الحجز #${params.id.slice(-8).toUpperCase()} | RentCar`,
    description: "تفاصيل الحجز والدفع والتقييم",
  };
}

export default function BookingDetailRoute({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
            <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </div>
      }
    >
      <BookingDetailPage bookingId={params.id} />
    </Suspense>
  );
}