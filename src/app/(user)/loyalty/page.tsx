// ============================================================
// src/app/(user)/loyalty/page.tsx
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoyaltyPage } from "@/components/organisms/user/LoyaltyPage";

export const metadata: Metadata = {
  title: "برنامج الولاء | RentCar",
  description: "نقاطك، مستواك، ومزاياك الحصرية",
};

export default function LoyaltyRoute() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-44 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <LoyaltyPage />

    </Suspense>
  );
}