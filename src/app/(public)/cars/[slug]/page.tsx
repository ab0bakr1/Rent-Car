// ============================================================
// src/app/(user)/cars/[slug]/page.tsx
// Route: /cars/[slug] — صفحة تفاصيل السيارة
// ============================================================
import type { Metadata } from "next";
import { CarDetailPage } from "@/components/organisms/CarDetailPage";
import { CarDetailSkeleton } from "@/components/atoms/skeletons";
import { Suspense } from "react";
import PublicLayout from "@/components/layout/PublicLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `تفاصيل السيارة | RentCar`,
    description: "اطلع على تفاصيل السيارة وقيّمها واحجزها الآن",
  };
}

export default async function CarDetailRoute({ params }: Props) {
  const { slug } = await params;
  return (
    <PublicLayout >
      <Suspense fallback={<CarDetailSkeleton />}>
        <CarDetailPage idOrSlug={slug} />
      </Suspense>
    </PublicLayout>
  );
}