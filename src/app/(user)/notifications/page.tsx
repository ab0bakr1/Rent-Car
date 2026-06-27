// ============================================================
// src/app/(user)/notifications/page.tsx
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { NotificationsPage } from "@/components/organisms/user/NotificationsPage";
import { NotificationsSkeleton } from "@/components/atoms/skeletons";

export const metadata: Metadata = {
  title: "الإشعارات | RentCar",
  description: "إشعاراتك وعروضك الحصرية",
};

export default function NotificationsRoute() {
  return (
    <Suspense fallback={<NotificationsSkeleton count={5} />}>
      <NotificationsPage />
    </Suspense>
  );
}