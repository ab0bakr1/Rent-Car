// ============================================================
// src/app/(user)/cars/page.tsx
// Route: /cars — صفحة تصفح السيارات
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { CarsPage } from "@/components/organisms/user/CarsPage";
import { CarsGridSkeleton } from "@/components/atoms/skeletons";

export const metadata: Metadata = {
  title: "تصفح السيارات | RentCar",
  description: "اختر سيارتك من بين مئات السيارات المتاحة بأسعار تنافسية",
};

export default function CarsRoute() {
  return (
    <Suspense fallback={<CarsGridSkeleton count={9} />}>
      <CarsPage />
    </Suspense>
  );
}