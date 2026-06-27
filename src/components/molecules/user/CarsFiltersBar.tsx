// ============================================================
// src/components/molecules/user/CarsFiltersBar.tsx
// شريط الفلاتر — /cars
// ============================================================
"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { CarsFilters } from "@/types/user.types";

interface CarsFiltersBarProps {
  filters: CarsFilters;
  onChange: (updated: Partial<CarsFilters>) => void;
  onReset: () => void;
}

const BRANDS = ["تويوتا", "BMW", "مرسيدس", "هوندا", "نيسان", "هيونداي", "كيا", "فورد"];
const CATEGORIES = ["سيدان", "SUV", "كوبيه", "رياضية", "ميني فان", "بيك أب"];
const YEARS = Array.from({ length: 8 }, (_, i) => String(2024 - i));

const selectClass =
  "h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 " +
  "text-sm text-gray-700 dark:text-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 " +
  "appearance-none cursor-pointer min-w-[120px]";

export function CarsFiltersBar({ filters, onChange, onReset }: CarsFiltersBarProps) {
  const hasActive =
    !!(filters.search || filters.brand || filters.category ||
       filters.transmission || filters.fuelType || filters.minPrice || filters.maxPrice);

  return (
    <div className="space-y-3">
      {/* صف أول: بحث */}
      <div className="relative">
        <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          placeholder="ابحث بالاسم أو الماركة..."
          className={cn(
            "w-full h-11 pe-10 ps-4 rounded-xl border border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-900 text-sm placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
        />
      </div>

      {/* صف ثاني: فلاتر */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />

        {/* الماركة */}
        <select
          value={filters.brand ?? ""}
          onChange={(e) => onChange({ brand: e.target.value || undefined, page: 1 })}
          className={selectClass}
        >
          <option value="">الماركة</option>
          {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        {/* الفئة */}
        <select
          value={filters.category ?? ""}
          onChange={(e) => onChange({ category: e.target.value || undefined, page: 1 })}
          className={selectClass}
        >
          <option value="">الفئة</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* ناقل الحركة */}
        <select
          value={filters.transmission ?? ""}
          onChange={(e) =>
            onChange({ transmission: (e.target.value as any) || undefined, page: 1 })
          }
          className={selectClass}
        >
          <option value="">ناقل الحركة</option>
          <option value="automatic">أوتوماتيك</option>
          <option value="manual">يدوي</option>
        </select>

        {/* الوقود */}
        <select
          value={filters.fuelType ?? ""}
          onChange={(e) =>
            onChange({ fuelType: (e.target.value as any) || undefined, page: 1 })
          }
          className={selectClass}
        >
          <option value="">الوقود</option>
          <option value="petrol">بنزين</option>
          <option value="diesel">ديزل</option>
          <option value="electric">كهربائي</option>
          <option value="hybrid">هجين</option>
        </select>

        {/* السنة */}
        <select
          value={filters.minYear ?? ""}
          onChange={(e) =>
            onChange({ minYear: e.target.value ? Number(e.target.value) : undefined, page: 1 })
          }
          className={selectClass}
        >
          <option value="">السنة</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* نطاق السعر */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (!val) return onChange({ minPrice: undefined, maxPrice: undefined });
            const [min, max] = val.split("-").map(Number);
            onChange({ minPrice: min, maxPrice: max || undefined, page: 1 });
          }}
          className={selectClass}
        >
          <option value="">السعر</option>
          <option value="0-200">أقل من 200 ر.س</option>
          <option value="200-500">200 — 500 ر.س</option>
          <option value="500-1000">500 — 1000 ر.س</option>
          <option value="1000-">أكثر من 1000 ر.س</option>
        </select>

        {/* زر إعادة الضبط */}
        {hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 
                       border border-red-200 rounded-xl px-3 h-10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            إعادة ضبط
          </button>
        )}
      </div>
    </div>
  );
}