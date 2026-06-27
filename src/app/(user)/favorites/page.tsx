// ============================================================
// src/app/(user)/favorites/page.tsx
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { FavoritesPage } from "@/components/organisms/user/FavoritesPage";
import { CarsGridSkeleton } from "@/components/atoms/skeletons";

export const metadata: Metadata = {
  title: "المفضلات | RentCar",
  description: "السيارات التي أضفتها إلى مفضلتك",
};

export default function FavoritesRoute() {
  return (
    <Suspense fallback={<CarsGridSkeleton count={6} />}>
      <FavoritesPage />
    </Suspense>
  );
}