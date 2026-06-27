// ============================================================
// src/app/(user)/bookings/my/page.tsx
// Route: /bookings/my — حجوزاتي
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { MyBookingsPage } from "@/components/organisms/user/MyBookingsPage";
import { BookingsListSkeleton } from "@/components/atoms/skeletons";

export const metadata: Metadata = {
  title: "حجوزاتي | RentCar",
  description: "تصفح وإدارة جميع حجوزاتك",
};

export default function MyBookingsRoute() {
  return (
    <Suspense fallback={<BookingsListSkeleton count={4} />}>
      <MyBookingsPage />
    </Suspense>
  );
}