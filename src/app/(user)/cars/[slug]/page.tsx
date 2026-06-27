// ============================================================
// src/app/(user)/cars/[slug]/page.tsx
// Route: /cars/[slug] — صفحة تفاصيل السيارة
// ============================================================
import type { Metadata } from "next";
import { CarDetailPage } from "@/components/organisms/user/CarDetailPage";
import { CarDetailSkeleton } from "@/components/atoms/skeletons";
import { Suspense } from "react";

interface Props {
  params: { slug: string };
}

// SEO ديناميكي
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // يمكن جلب اسم السيارة هنا من الـ API لتحسين الـ SEO
  return {
    title: `تفاصيل السيارة | RentCar`,
    description: "اطلع على تفاصيل السيارة وقيّمها واحجزها الآن",
  };
}

export default function CarDetailRoute({ params }: Props) {
  return (
    <Suspense fallback={<CarDetailSkeleton />}>
      <CarDetailPage idOrSlug={params.slug} />
    </Suspense>
  );
}