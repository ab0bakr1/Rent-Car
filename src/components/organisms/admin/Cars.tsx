"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ConfirmDialog from "@/components/molecules/Confirmdialog";
import StatusBadge from "@/components/molecules/Statusbadge";
import  EmptyState from "@/components/molecules/Emptystate";
import CarModal, { type CarModalMode } from "@/components/organisms/admin/Modal/CarModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  fetchCars,
  addCar,
  updateCar,
  deleteCar,
  type Car,
  type CarFormData,
  type CarStatus,
} from "@/utils/cars-service";
import { getBrands, type Brand } from "@/utils/brands-service";
import { getCategories, type Category } from "@/utils/categories-service";
import {
  Search,
  Loader2,
  CarFront,
  Pencil,
  Trash2,
  Plus,
  Users as SeatsIcon,
  Fuel,
  Settings2,
  Star,
} from "lucide-react";

const STATUS_CONFIG: Record<
  CarStatus,
  { label: string; color: "green" | "yellow" | "red" | "gray" }
> = {
  AVAILABLE: { label: "متاحة", color: "green" },
  BOOKED: { label: "محجوزة", color: "yellow" },
  MAINTENANCE: { label: "صيانة", color: "red" },
  INACTIVE: { label: "غير نشطة", color: "gray" },
};

const TRANSMISSION_LABELS: Record<string, string> = {
  AUTOMATIC: "أوتوماتيك",
  MANUAL: "يدوي",
};

const FUEL_LABELS: Record<string, string> = {
  PETROL: "بنزين",
  DIESEL: "ديزل",
  ELECTRIC: "كهربائي",
  HYBRID: "هجين",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CarStatus | "">("");
  const [brandFilter, setBrandFilter] = useState("");

  const [modalMode, setModalMode] = useState<CarModalMode>(null);
  const [activeCar, setActiveCar] = useState<Car | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Car | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [carsData, brandsData, categoriesData] = await Promise.all([
        fetchCars(),
        getBrands(),
        getCategories(),
      ]);
      setCars(carsData ?? []);
      setBrands(brandsData ?? []);
      setCategories(categoriesData ?? []);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب بيانات السيارات. تأكد من اتصال الخادم.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.model?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || car.status === statusFilter;
      const matchesBrand =
        !brandFilter || car.brandId === brandFilter || car.brand?.id === brandFilter;
      return matchesSearch && matchesStatus && matchesBrand;
    });
  }, [cars, search, statusFilter, brandFilter]);

  const handleSubmit = async (data: CarFormData) => {
    setSaving(true);
    try {
      if (modalMode === "add") {
        const created = await addCar(data as Omit<Car, "id">);
        setCars((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && activeCar) {
        const updated = await updateCar(activeCar.id, data);
        setCars((prev) => prev.map((c) => (c.id === activeCar.id ? updated : c)));
      }
      setModalMode(null);
      setActiveCar(null);
    } catch (err) {
      console.error(err);
      alert("فشل حفظ السيارة.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCar(deleteTarget.id);
      setCars((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل حذف السيارة. قد تكون مرتبطة بحجوزات موجودة.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة السيارات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              عرض وتعديل وحذف سيارات الأسطول.
            </Text>
          </div>
          <button
            onClick={() => setModalMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={18} />
            سيارة جديدة
          </button>
        </div>

        {/* الفلاتر */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم السيارة أو الموديل..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CarStatus | "")}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">كل الحالات</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">كل الماركات</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 font-medium text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<CarFront size={28} />}
            title="لا توجد سيارات"
            description="لم يتم العثور على سيارات مطابقة لبحثك."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((car) => (
              <div
                key={car.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                  {car.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <CarFront size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <StatusBadge
                      label={STATUS_CONFIG[car.status]?.label ?? car.status}
                      color={STATUS_CONFIG[car.status]?.color ?? "gray"}
                    />
                  </div>
                  {car.isFeatured && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
                      <Star size={12} className="fill-yellow-900" />
                      مميّزة
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{car.name}</p>
                      <p className="text-xs text-gray-400">
                        {car.brand?.name ?? brands.find((b) => b.id === car.brandId)?.name ?? ""}
                        {" · "}
                        {car.model} {car.year ? `(${car.year})` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {car.seats && (
                      <span className="flex items-center gap-1">
                        <SeatsIcon size={13} />
                        {car.seats}
                      </span>
                    )}
                    {car.transmission && (
                      <span className="flex items-center gap-1">
                        <Settings2 size={13} />
                        {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
                      </span>
                    )}
                    {car.fuelType && (
                      <span className="flex items-center gap-1">
                        <Fuel size={13} />
                        {FUEL_LABELS[car.fuelType] ?? car.fuelType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      ${car.pricePerDay}
                      <span className="text-xs font-normal text-gray-400">/يوم</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setActiveCar(car);
                          setModalMode("edit");
                        }}
                        className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(car)}
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CarModal
        mode={modalMode}
        car={activeCar}
        brands={brands}
        categories={categories}
        isLoading={saving}
        onClose={() => {
          setModalMode(null);
          setActiveCar(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف السيارة"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        danger
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}