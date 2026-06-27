"use client";

import { useEffect, useState, useRef } from "react";
import type {
  Car,
  CarFormData,
  CarStatus,
  Transmission,
  FuelType,
} from "@/utils/cars-service";
import type { Brand } from "@/utils/brands-service";
import type { Category } from "@/utils/categories-service";
import { apiClient } from "@/lib/api-client";
import {
  X,
  Upload,
  Trash2,
  Star,
  ImagePlus,
  Loader2,
} from "lucide-react";

export type CarModalMode = "add" | "edit" | null;

interface Props {
  mode: CarModalMode;
  car?: Car | null;
  brands: Brand[];
  categories: Category[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormData) => Promise<{ id?: string } | void>;
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

// ── Image upload state ────────────────────────────────────────────────────────
interface ImageEntry {
  id: string; // uuid محلي للـ key
  file: File;
  preview: string;
  isMain: boolean;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
}

let _imgCounter = 0;
const newId = () => `img-${++_imgCounter}`;

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
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // مسح الـ previews عند إغلاق المودال
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === "edit" && car) {
      setForm({
        name: car.name,
        model: car.model,
        year: Number(car.year),
        pricePerDay: Number(car.pricePerDay),
        image: car.image ?? "",
        status: car.status,
        transmission: car.transmission,
        fuelType: car.fuelType,
        seats: Number(car.seats),
        brandId: car.brandId ?? car.brand?.id ?? "",
        categoryId: car.categoryId ?? car.category?.id ?? "",
        isFeatured: car.isFeatured ?? false,
      });
      setImages([]);
    } else if (mode === "add") {
      setForm(EMPTY_FORM);
      setImages([]);
    }
  }, [mode, car]);

  if (!mode) return null;

  // ── اختيار ملفات جديدة ───────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const newEntries: ImageEntry[] = files.map((file, i) => ({
      id: newId(),
      file,
      preview: URL.createObjectURL(file),
      // أول صورة تُضاف تكون رئيسية إن لم يكن هناك رئيسية بعد
      isMain: images.length === 0 && i === 0,
      uploading: false,
      uploaded: false,
      error: null,
    }));

    setImages((prev) => [...prev, ...newEntries]);
    // مسح الـ input لإتاحة إعادة الاختيار
    e.target.value = "";
  };

  const setMainImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isMain: img.id === id }))
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      const rest = prev.filter((img) => img.id !== id);
      // إذا حُذفت الرئيسية، اجعل الأولى رئيسية
      if (removed?.isMain && rest.length > 0) {
        rest[0].isMain = true;
      }
      return rest;
    });
  };

  // ── رفع صورة واحدة إلى الـ API ───────────────────────────────────────────
  const uploadSingleImage = async (
    carId: string,
    entry: ImageEntry
  ): Promise<void> => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === entry.id ? { ...img, uploading: true, error: null } : img
      )
    );
    try {
      const fd = new FormData();
      fd.append("image", entry.file);
      await apiClient.post(
        `/cars/${carId}/images?isMain=${entry.isMain}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setImages((prev) =>
        prev.map((img) =>
          img.id === entry.id
            ? { ...img, uploading: false, uploaded: true }
            : img
        )
      );
    } catch {
      setImages((prev) =>
        prev.map((img) =>
          img.id === entry.id
            ? { ...img, uploading: false, error: "فشل الرفع" }
            : img
        )
      );
    }
  };

  // ── إرسال الفورم ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await onSubmit(form);

    // رفع الصور فقط عند الإضافة (edit يمكن إضافتها لاحقاً)
    if (mode === "add" && images.length > 0) {
      const carId =
        (result as any)?.id ??
        (result as any)?.data?.id ??
        (result as any)?.data?.data?.id;

      if (carId) {
        setUploadingImages(true);
        await Promise.allSettled(
          images.map((img) => uploadSingleImage(carId, img))
        );
        setUploadingImages(false);
      }
    }
  };

  const isBusy = isLoading || uploadingImages;

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl max-h-[92vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {mode === "add" ? "إضافة سيارة جديدة" : "تعديل السيارة"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* ── القسم 1: البيانات الأساسية ─────────────────────────────── */}
          <section>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              البيانات الأساسية
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-sm">اسم السيارة</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="تويوتا كامري"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-sm">الموديل</label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
                  placeholder="Camry"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="label-sm">الماركة</label>
                <select
                  required
                  value={form.brandId}
                  onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))}
                  className="input-field"
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
                <label className="label-sm">الفئة</label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="input-field"
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

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="label-sm">سنة الصنع</label>
                <input
                  type="number"
                  required
                  min={1990}
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, year: Number(e.target.value) }))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-sm">السعر / اليوم ($)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step="0.01"
                  value={form.pricePerDay}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      pricePerDay: Number(e.target.value),
                    }))
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-sm">المقاعد</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={form.seats}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, seats: Number(e.target.value) }))
                  }
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* ── القسم 2: المواصفات ──────────────────────────────────────── */}
          <section>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              المواصفات
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label-sm">الحالة</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      status: e.target.value as CarStatus,
                    }))
                  }
                  className="input-field"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-sm">ناقل الحركة</label>
                <select
                  value={form.transmission}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      transmission: e.target.value as Transmission,
                    }))
                  }
                  className="input-field"
                >
                  {TRANSMISSION_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-sm">نوع الوقود</label>
                <select
                  value={form.fuelType}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      fuelType: e.target.value as FuelType,
                    }))
                  }
                  className="input-field"
                >
                  {FUEL_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={form.isFeatured ?? false}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                }
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                سيارة مميّزة (تظهر في الواجهة الرئيسية)
              </span>
            </label>
          </section>

          {/* ── القسم 3: الصور ──────────────────────────────────────────── */}
          <section>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              الصور
            </p>

            {/* زر إضافة صور */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors w-full justify-center text-sm font-medium mb-3"
            >
              <ImagePlus size={18} />
              اختر صور من جهازك
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* شبكة الصور المختارة */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      img.isMain
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {/* Preview */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.preview}
                      alt=""
                      className="w-full h-24 object-cover"
                    />

                    {/* شارة الرئيسية */}
                    {img.isMain && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Star size={9} className="fill-white" />
                        رئيسية
                      </div>
                    )}

                    {/* حالة الرفع */}
                    {img.uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={20} className="text-white animate-spin" />
                      </div>
                    )}
                    {img.uploaded && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold bg-white/80 px-2 py-0.5 rounded-full">
                          ✓ تم
                        </span>
                      </div>
                    )}
                    {img.error && (
                      <div className="absolute bottom-0 inset-x-0 bg-red-500 text-white text-[10px] text-center py-0.5">
                        {img.error}
                      </div>
                    )}

                    {/* أزرار التحكم */}
                    {!img.uploading && !img.uploaded && (
                      <div className="absolute bottom-1 inset-x-1 flex gap-1">
                        {!img.isMain && (
                          <button
                            type="button"
                            onClick={() => setMainImage(img.id)}
                            title="اجعلها رئيسية"
                            className="flex-1 bg-blue-500/90 hover:bg-blue-600 text-white text-[10px] font-medium py-0.5 rounded-md transition-colors"
                          >
                            رئيسية
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          title="حذف"
                          className="bg-red-500/90 hover:bg-red-600 text-white p-0.5 rounded-md transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* بطاقة إضافة المزيد */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Upload size={18} />
                  <span className="text-[11px]">إضافة</span>
                </button>
              </div>
            )}

            {/* حقل رابط الصورة (للتعديل أو كبديل) */}
            <div className="mt-3">
              <label className="label-sm">
                {mode === "edit"
                  ? "رابط الصورة الحالية (اختياري للتغيير)"
                  : "أو أدخل رابط صورة مباشر"}
              </label>
              <input
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="https://..."
                className="input-field"
                required={mode === "add" && images.length === 0}
              />
            </div>
          </section>

          {/* ── أزرار الحفظ والإلغاء ─────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {isBusy && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {uploadingImages
                ? "جاري رفع الصور..."
                : isLoading
                ? "جاري الحفظ..."
                : mode === "add"
                ? "إضافة السيارة"
                : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>

      {/* Tailwind utility classes المدمجة عبر style tag */}
      <style>{`
        .label-sm {
          display: block;
          margin-bottom: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgb(55 65 81);
        }
        .dark .label-sm { color: rgb(209 213 219); }
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(209 213 219);
          background: rgb(249 250 251);
          padding: 0.55rem 0.875rem;
          font-size: 0.875rem;
          color: rgb(17 24 39);
          transition: border-color .15s, box-shadow .15s;
          outline: none;
        }
        .dark .input-field {
          border-color: rgb(55 65 81);
          background: rgb(31 41 55);
          color: white;
        }
        .input-field:focus {
          border-color: rgb(99 102 241);
          box-shadow: 0 0 0 2px rgba(99,102,241,.2);
        }
      `}</style>
    </div>
  );
}