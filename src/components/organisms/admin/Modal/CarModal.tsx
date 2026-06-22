"use client";

import { useEffect, useState } from "react";
import type {
  Car,
  CarFormData,
  CarStatus,
  Transmission,
  FuelType,
} from "@/utils/cars-service";
import type { Brand } from "@/utils/brands-service";
import type { Category } from "@/utils/categories-service";

export type CarModalMode = "add" | "edit" | null;

interface Props {
  mode: CarModalMode;
  car?: Car | null;
  brands: Brand[];
  categories: Category[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormData) => Promise<void>;
}

const EMPTY_FORM: CarFormData = {
  name: "",
  model: "",
  year: new Date().getFullYear(),
  pricePerDay: 0,
  image: "",
  status: "AVAILABLE",
  transmission: "AUTOMATIC",
  fuelType: "PETROL",
  seats: 5,
  brandId: "",
  categoryId: "",
  isFeatured: false,
};

const STATUS_OPTIONS: { value: CarStatus; label: string }[] = [
  { value: "AVAILABLE", label: "متاحة" },
  { value: "BOOKED", label: "محجوزة" },
  { value: "MAINTENANCE", label: "صيانة" },
  { value: "INACTIVE", label: "غير نشطة" },
];

const TRANSMISSION_OPTIONS: { value: Transmission; label: string }[] = [
  { value: "AUTOMATIC", label: "أوتوماتيك" },
  { value: "MANUAL", label: "يدوي" },
];

const FUEL_OPTIONS: { value: FuelType; label: string }[] = [
  { value: "PETROL", label: "بنزين" },
  { value: "DIESEL", label: "ديزل" },
  { value: "ELECTRIC", label: "كهربائي" },
  { value: "HYBRID", label: "هجين" },
];

export default function CarModal({
  mode,
  car,
  brands,
  categories,
  isLoading,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CarFormData>(EMPTY_FORM);

useEffect(() => {
  if (mode === "edit" && car) {
    setForm({
      name: car.name,
      model: car.model,
      year: Number(car.year),
      pricePerDay: Number(car.pricePerDay),
      image: car.image,
      status: car.status,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seats: Number(car.seats),
      brandId: car.brandId ?? car.brand?.id ?? "",
      categoryId: car.categoryId ?? car.category?.id ?? "",
      isFeatured: car.isFeatured ?? false,
    });
  } else if (mode === "add") {
    setForm(EMPTY_FORM);
  }
}, [mode, car]);
  if (!mode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "إضافة سيارة جديدة" : "تعديل السيارة"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                اسم السيارة
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Camry"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الموديل
              </label>
              <input
                required
                value={form.model}
                onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
                placeholder="2024"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الماركة
              </label>
              <select
                required
                value={form.brandId}
                onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="">اختر الماركة</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الفئة
              </label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="">اختر الفئة</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                سنة الصنع
              </label>
              <input
                type="number"
                required
                min={1990}
                max={2100}
                value={form.year}
                onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                السعر/اليوم ($)
              </label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={form.pricePerDay}
                onChange={(e) => setForm((p) => ({ ...p, pricePerDay: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                عدد المقاعد
              </label>
              <input
                type="number"
                required
                min={1}
                max={20}
                value={form.seats}
                onChange={(e) => setForm((p) => ({ ...p, seats: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as CarStatus }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                ناقل الحركة
              </label>
              <select
                value={form.transmission}
                onChange={(e) =>
                  setForm((p) => ({ ...p, transmission: e.target.value as Transmission }))
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                {TRANSMISSION_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                نوع الوقود
              </label>
              <select
                value={form.fuelType}
                onChange={(e) => setForm((p) => ({ ...p, fuelType: e.target.value as FuelType }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              >
                {FUEL_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              رابط الصورة
            </label>
            <input
              required
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured ?? false}
              onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">سيارة مميّزة (تظهر في الواجهة الرئيسية)</span>
          </label>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {mode === "add" ? "إضافة" : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}