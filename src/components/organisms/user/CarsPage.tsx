// ============================================================
// src/components/organisms/user/CarsPage.tsx
// صفحة تصفح السيارات — /cars
// مميزات: Skeleton Loading، فلاتر، Pagination، مفضلة
// ============================================================
"use client";

import { useState, useCallback } from "react";
import { useCars, useFavorites } from "@/hooks/user/useUserQueries";
import { CarCard } from "@/components/molecules/user/CarCard";
import { CarsFiltersBar } from "@/components/molecules/user/CarsFiltersBar";
import { CarsGridSkeleton } from "@/components/atoms/skeletons";
import { useNav } from "@/hooks/useNav";
import type { CarsFilters } from "@/types/user.types";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

const DEFAULT_FILTERS: CarsFilters = { page: 1, limit: 9 };

export function CarsPage() {
  const [filters, setFilters] = useState<CarsFilters>(DEFAULT_FILTERS);
  const { go } = useNav();

  // البيانات
  const { data, isLoading, isError, isFetching } = useCars(filters);
  const { data: favorites } = useFavorites();
  const favIds = new Set(favorites?.map((f) => f.id) ?? []);

  // تحديث الفلاتر
  const handleFilterChange = useCallback((updated: Partial<CarsFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Pagination
  const totalPages = data?.totalPages ?? 1;
  const currentPage = filters.page ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تصفح السيارات
        </h1>
        {data && (data.total ?? 0) > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {(data.total ?? 0).toLocaleString("ar-SA")} سيارة متاحة
          </p>
        )}
      </div>

      {/* Filters */}
      <CarsFiltersBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Grid — Skeleton أثناء التحميل الأول */}
      {isLoading ? (
        <CarsGridSkeleton count={9} />
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-gray-400">حدث خطأ أثناء تحميل السيارات.</p>
          <button
            onClick={() => setFilters({ ...filters })}
            className="mt-3 text-sm text-blue-600 underline"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (data?.data?.length ?? 0) === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🚗</p>
          <p className="text-gray-500">لا توجد سيارات تطابق فلاترك.</p>
          <button
            onClick={handleReset}
            className="mt-3 text-sm text-blue-600 underline"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <>
          {/* Refetch shimmer — shimmer طفيف أثناء تغيير الفلاتر */}
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200",
              isFetching && !isLoading && "opacity-60"
            )}
          >
            {(data?.data ?? []).map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isFavorite={favIds.has(car.id)}
                showFavoriteBtn
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {/* زر السابق */}
              <button
                onClick={() =>
                  handleFilterChange({ page: currentPage - 1 })
                }
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border 
                           border-gray-200 dark:border-gray-700 text-gray-500
                           disabled:opacity-40 hover:border-blue-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* أرقام الصفحات */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange({ page })}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-medium border transition-all",
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"
                    )}
                  >
                    {page}
                  </button>
                )
              )}

              {/* زر التالي */}
              <button
                onClick={() =>
                  handleFilterChange({ page: currentPage + 1 })
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border 
                           border-gray-200 dark:border-gray-700 text-gray-500
                           disabled:opacity-40 hover:border-blue-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}