// ============================================================
// src/app/(user)/bookings/new/page.tsx
// Route: /bookings/new — صفحة الحجز الجديد
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { NewBookingPage } from "@/components/organisms/user/NewBookingPage";

export const metadata: Metadata = {
  title: "حجز جديد | RentCar",
  description: "احجز سيارتك الآن بخطوات بسيطة",
};

export default function NewBookingRoute() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
          </div>
        </div>
      }
    >
      <NewBookingPage />
    </Suspense>
  );
}