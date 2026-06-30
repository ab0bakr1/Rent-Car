// ============================================================
// src/components/organisms/user/CarDetailPage.tsx
// صفحة تفاصيل السيارة — /cars/[id]
// مميزات: صور، مواصفات، تقييمات، سيارات مشابهة، زر الحجز
// ============================================================
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users, Settings2, Zap, Calendar, Star, Heart, ChevronLeft, ChevronRight
} from "lucide-react";
import { useCar, useCarReviews, useSimilarCars, useFavorites, useToggleFavorite } from "@/hooks/user/useUserQueries";
import { CarDetailSkeleton } from "@/components/atoms/skeletons";
import { VipBadge } from "@/components/atoms/VipBadge";
import { CarCard } from "@/components/molecules/user/CarCard";
import { useNav } from "@/hooks/useNav";
import { getPath, buildPath } from "@/utils/routes";
import { cn } from "@/lib/cn";
import type { Car } from "@/types/user.types";

// ─── Helpers لتطبيع بيانات الـ API ──────────────────────────
function getBrandName(brand: unknown): string {
  if (!brand) return "";
  if (typeof brand === "string") return brand;
  return (brand as any)?.name ?? "";
}

function getCategoryName(category: unknown): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return (category as any)?.name ?? "";
}

function getValidImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter((img): img is string => typeof img === "string" && img.trim() !== "");
}

// ─── Spec box ─────────────────────────────────────────────────
function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-white">{value}</span>
    </div>
  );
}

// ─── Stars display ────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "w-4 h-4",
            s <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          )}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export function CarDetailPage({ idOrSlug }: { idOrSlug: string }) {
  const router = useRouter();
  const { go, goBack, href } = useNav();
  const [activeImg, setActiveImg] = useState(0);

  const { data: car, isLoading, isError, error } = useCar(idOrSlug);
  const { data: reviews } = useCarReviews(idOrSlug);
  const { data: similar } = useSimilarCars(idOrSlug);
  const { data: favorites } = useFavorites();
  const toggleFav = useToggleFavorite();

  const isFav = favorites?.some((f) => f.id === car?.id) ?? false;

  // debug في development
  if (process.env.NODE_ENV === "development" && (isError || (!isLoading && !car))) {
    console.error("[CarDetailPage] فشل تحميل السيارة:", { idOrSlug, error, car });
  }

  if (isLoading) return <CarDetailSkeleton />;

  if (isError || !car) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🚗</p>
        <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
          تعذّر تحميل بيانات السيارة
        </p>
        <p className="text-sm text-gray-400 mb-4">
          ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{idOrSlug}</code>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 h-10 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // تطبيع البيانات القادمة من الـ API
  const validImages = getValidImages(car.images);
  const brandName   = getBrandName(car.brand);

  const fuelLabel: Record<string, string> = {
    petrol: "بنزين", diesel: "ديزل", electric: "كهربائي", hybrid: "هجين",
  };

  const statusLabel: Record<string, string> = {
    available: "متاحة", rented: "مؤجرة", maintenance: "صيانة",
  };

  const favIds = new Set(favorites?.map((f) => f.id) ?? []);

  return (
    <div className="mt-40 mb-20">
      <div className="ds-container">
        {/* زر الرجوع */}
        <button
          onClick={() => goBack()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          العودة للسيارات
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── العمود الأيسر: صور + تفاصيل ─── */}
          <div className="lg:col-span-2 space-y-5">
            {/* معرض الصور */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 h-72">
              {validImages.length > 0 ? (
                <>
                  <Image
                    src={validImages[activeImg] ?? ""}
                    alt={car.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* أسهم التنقل */}
                  {validImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImg((p) => (p - 1 + validImages.length) % validImages.length)}
                        className="absolute start-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 
                                  dark:bg-gray-900/80 rounded-full flex items-center justify-center shadow"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveImg((p) => (p + 1) % validImages.length)}
                        className="absolute end-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 
                                  dark:bg-gray-900/80 rounded-full flex items-center justify-center shadow"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-200 dark:text-gray-600">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {validImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn(
                      "relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                      activeImg === i
                        ? "border-blue-500"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}

            {/* مواصفات */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <SpecBox label="الماركة" value={getBrandName(car.brand)} />
              <SpecBox label="السنة" value={String(car.year)} />
              <SpecBox label="ناقل الحركة" value={car.transmission === "automatic" ? "أوتوماتيك" : "يدوي"} />
              <SpecBox label="الوقود" value={fuelLabel[car.fuelType]} />
              <SpecBox label="المقاعد" value={String(car.seats)} />
              <SpecBox label="اللون" value={car.color} />
            </div>

            {/* وصف */}
            {car.description && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  وصف السيارة
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            {/* التقييمات */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                آراء العملاء
                {reviews?.length ? (
                  <span className="text-xs text-gray-400">({reviews.length})</span>
                ) : null}
              </h2>

              {!reviews?.length ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  لا توجد تقييمات بعد.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="flex gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm flex-shrink-0">
                        {rev.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {rev.userName}
                          </span>
                          <Stars rating={rev.rating} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {rev.comment}
                        </p>
                        <time className="text-xs text-gray-400 mt-1 block">
                          {new Date(rev.createdAt).toLocaleDateString("ar-SA")}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── العمود الأيمن: بطاقة الحجز + مشابهة ─── */}
          <div className="space-y-4">
            {/* بطاقة الحجز */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-4">
              {/* السعر */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {car.pricePerDay.toLocaleString("ar-SA")}
                </span>
                <span className="text-sm text-gray-400 me-1"> ر.س / يوم</span>
              </div>

              {/* الشارات */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium",
                    car.status === "available"
                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                  )}
                >
                  {statusLabel[car.status]}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {getCategoryName(car.category)}
                </span>
                {car.rating >= 4.5 && (
                  <VipBadge tier="gold" size="sm" showLabel={false} />
                )}
              </div>

              {/* أزرار */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    router.push(getPath("NewBooking") + `?carId=${car.id}&slug=${car.slug}`);
                  }}
                  disabled={car.status !== "available"}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                            disabled:cursor-not-allowed text-white font-semibold rounded-xl
                            transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  احجز الآن
                </button>
                <button
                  onClick={() => toggleFav.mutate({ carId: car.id, isFav: isFav })}
                  className={cn(
                    "w-full h-11 rounded-xl border font-medium text-sm transition-all flex items-center justify-center gap-2",
                    isFav
                      ? "border-red-300 text-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-300"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isFav && "fill-red-500 text-red-500")} />
                  {isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                </button>
              </div>
            </div>

            {/* سيارات مشابهة */}
            {similar?.length ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  سيارات مشابهة
                </h2>
                <div className="space-y-3">
                  {similar.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      onClick={() => router.push(buildPath("CarDetail", { slug: s.slug }))}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 
                                dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <div className="w-14 h-10 rounded-lg bg-blue-50 dark:bg-gray-700 flex-shrink-0 overflow-hidden relative">
                        {s.images?.[0] && (
                          <Image src={s.images[0]} alt={s.name} fill className="object-cover" sizes="56px" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {s.pricePerDay.toLocaleString("ar-SA")} ر.س/يوم
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          s.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {statusLabel[s.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}