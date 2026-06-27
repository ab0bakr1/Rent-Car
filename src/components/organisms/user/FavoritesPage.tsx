// ============================================================
// src/components/organisms/user/FavoritesPage.tsx
// صفحة المفضلات — /favorites
// ============================================================
"use client";

import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/user/useUserQueries";
import { CarCard } from "@/components/molecules/user/CarCard";
import { CarsGridSkeleton } from "@/components/atoms/skeletons";

export function FavoritesPage() {
  const router = useRouter();
  const { data: favorites, isLoading } = useFavorites();
  const favIds = new Set(favorites?.map((f) => f.id) ?? []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المفضلات</h1>
        {favorites?.length ? (
          <p className="text-sm text-gray-500 mt-1">{favorites.length} سيارة محفوظة</p>
        ) : null}
      </div>

      {isLoading ? (
        <CarsGridSkeleton count={6} />
      ) : !favorites?.length ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-5xl mb-3">❤️</p>
          <p className="text-gray-500 mb-3">لا توجد سيارات في مفضلتك بعد.</p>
          <button
            onClick={() => router.push("/cars")}
            className="px-5 h-10 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            تصفح السيارات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isFavorite={favIds.has(car.id)}
              showFavoriteBtn
            />
          ))}
        </div>
      )}
    </div>
  );
}