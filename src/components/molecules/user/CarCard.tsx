// ============================================================
// src/components/molecules/user/CarCard.tsx
// بطاقة السيارة — تُستخدم في /cars و /favorites والمشابهة
// ============================================================
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Users, Zap, Settings2, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { useToggleFavorite } from "@/hooks/user/useUserQueries";
import type { Car } from "@/types/user.types";

// ─── Status badge ─────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  available:   { label: "متاحة",   className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" },
  rented:      { label: "مؤجرة",    className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" },
  maintenance: { label: "صيانة",   className: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400" },
};

// يقبل أي قيمة يرجعها الـ API (petrol / gasoline / بنزين ...)
const FUEL_MAP: Record<string, { label: string; Icon: typeof Zap }> = {
  petrol:   { label: "بنزين",    Icon: Zap },
  gasoline: { label: "بنزين",    Icon: Zap },
  diesel:   { label: "ديزل",     Icon: Zap },
  electric: { label: "كهربائي",  Icon: Zap },
  hybrid:   { label: "هجين",     Icon: Zap },
};

const STATUS_FALLBACK = { label: "غير معروف", className: "bg-gray-100 text-gray-500" };
const FUEL_FALLBACK   = { label: "—",          Icon: Zap };

// ─── Props ───────────────────────────────────────────────────
interface CarCardProps {
  car: Car;
  isFavorite?: boolean;
  showFavoriteBtn?: boolean;
}

export function CarCard({
  car,
  isFavorite = false,
  showFavoriteBtn = true,
}: CarCardProps) {
  const router = useRouter();
  const toggleFav = useToggleFavorite();
  const status   = STATUS_MAP[car.status]   ?? STATUS_FALLBACK;
  const fuelEntry = FUEL_MAP[car.fuelType]  ?? FUEL_FALLBACK;
  const FuelIcon  = fuelEntry.Icon;

  // الـ API قد يرجع brand كـ string أو كـ { id, name, logo }
  const brandName =
    typeof car.brand === "string"
      ? car.brand
      : (car.brand as any)?.name ?? "";

  // أول صورة صالحة فقط (تتجاهل الـ strings الفارغة)
  const firstImage = car.images?.find((img) => typeof img === "string" && img.trim() !== "") ?? null;

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation();
    toggleFav.mutate({ carId: car.id, isFav: isFavorite });
  }

  // ─── استخدم الـ slug فقط إذا كان هو نفس الـ ID (UUID)
  // إذا كان slug مختلف (مثل "tahw-2026-db8b58c4") استخدم الـ ID الحقيقي
  // لأن الـ backend يقبل UUID الكامل فقط
  const isSlugSameAsId = car.slug === car.id;
  const carPath = isSlugSameAsId || !car.slug
    ? `/cars/${car.id}`       // UUID الحقيقي
    : `/cars/${car.slug}`;    // slug (إذا كان الـ backend يدعمه)

  return (
    <article
      onClick={() => router.push(carPath)}
      className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900
                 overflow-hidden cursor-pointer transition-all duration-200
                 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md"
    >
      {/* صورة السيارة */}
      <div className="relative h-44 w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-300 dark:text-gray-600">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 13 17.5 13s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        <span
          className={cn(
            "absolute top-3 start-3 text-xs font-medium px-2.5 py-1 rounded-full",
            status.className
          )}
        >
          {status.label}
        </span>

        {/* Favorite button */}
        {showFavoriteBtn && (
          <button
            onClick={handleFav}
            disabled={toggleFav.isPending}
            aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            className={cn(
              "absolute top-3 end-3 w-8 h-8 rounded-full flex items-center justify-center",
              "bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700",
              "transition-all duration-200 hover:scale-110",
              toggleFav.isPending && "opacity-50"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 dark:text-gray-500"
              )}
            />
          </button>
        )}
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
          {car.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-3">
          {brandName} · {car.year}
        </p>

        {/* المواصفات */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Settings2 className="w-3.5 h-3.5" />
            {car.transmission === "automatic" ? "أوتوماتيك" : "يدوي"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <FuelIcon className="w-3.5 h-3.5" />
            {fuelEntry.label}
          </span>
        </div>

        {/* التقييم والسعر */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {car.pricePerDay.toLocaleString("ar-SA")}
            </span>
            <span className="text-xs text-gray-400 me-1"> ر.س / يوم</span>
          </div>
          {car.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {car.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}