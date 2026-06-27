// ============================================================
// src/app/(user)/payments/page.tsx
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentsPage } from "@/components/organisms/user/PaymentsPage";
import { StatsCardsSkeleton } from "@/components/atoms/skeletons";

export const metadata: Metadata = {
  title: "المدفوعات | RentCar",
  description: "سجل مدفوعاتك وبطاقاتك المحفوظة",
};

export default function PaymentsRoute() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <StatsCardsSkeleton count={4} />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <PaymentsPage />
    </Suspense>
  );
}