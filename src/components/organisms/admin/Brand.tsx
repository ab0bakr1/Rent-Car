"use client";

import { useEffect, useState, useCallback } from "react";
import EmptyState from "@/components/molecules/Emptystate";
import ConfirmDialog from "@/components/molecules/Confirmdialog";
import BrandModal, { type BrandModalMode } from "@/components/organisms/admin/Modal/BrandModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  type Brand,
  type BrandFormData,
} from "@/utils/brands-service";
import { Search, Loader2, Tag, Pencil, Trash2, Plus } from "lucide-react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<BrandModalMode>(null);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrands();
      setBrands(data ?? []);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب الماركات. تأكد من اتصال الخادم.");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data: BrandFormData) => {
    setSaving(true);
    try {
      if (modalMode === "add") {
        const created = await createBrand(data);
        setBrands((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && activeBrand) {
        const updated = await updateBrand(activeBrand.id, data);
        setBrands((prev) =>
          prev.map((b) => (b.id === activeBrand.id ? updated : b))
        );
      }
      setModalMode(null);
      setActiveBrand(null);
    } catch (err) {
      console.error(err);
      alert("فشل حفظ الماركة.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBrand(deleteTarget.id);
      setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل حذف الماركة. قد تكون مرتبطة بسيارات موجودة.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة الماركات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              إضافة وتعديل وحذف ماركات السيارات.
            </Text>
          </div>
          <button
            onClick={() => setModalMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={18} />
            ماركة جديدة
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن ماركة..."
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
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
            icon={<Tag size={28} />}
            title="لا توجد ماركات"
            description="ابدأ بإضافة ماركة سيارات جديدة."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((brand) => (
              <div
                key={brand.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {brand.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                  ) : (
                    <Tag size={20} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{brand.name}</p>
                  {typeof brand.carsCount === "number" && (
                    <p className="text-xs text-gray-400">{brand.carsCount} سيارة</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setActiveBrand(brand);
                      setModalMode("edit");
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(brand)}
                    className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BrandModal
        mode={modalMode}
        brand={activeBrand}
        isLoading={saving}
        onClose={() => {
          setModalMode(null);
          setActiveBrand(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الماركة"
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