// ============================================================
// src/app/(user)/profile/page.tsx
// ============================================================
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfilePage } from "@/components/organisms/user/ProfilePage";
import { ProfileSkeleton } from "@/components/atoms/skeletons";

export const metadata: Metadata = {
  title: "الملف الشخصي | RentCar",
  description: "تعديل بياناتك الشخصية ورخصة القيادة",
};

export default function ProfileRoute() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}