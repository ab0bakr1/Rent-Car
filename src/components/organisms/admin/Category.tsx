"use client";

import { useEffect, useState, useCallback } from "react";
import EmptyState from "@/components/molecules/Emptystate";
import ConfirmDialog from "@/components/molecules/Confirmdialog";
import CategoryModal, { type CategoryModalMode } from "@/components/organisms/admin/Modal/CategoryModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CategoryFormData,
} from "@/utils/categories-service";
import { Search, Loader2, LayoutGrid, Pencil, Trash2, Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<CategoryModalMode>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data ?? []);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب الفئات. تأكد من اتصال الخادم.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      if (modalMode === "add") {
        const created = await createCategory(data);
        setCategories((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && activeCategory) {
        const updated = await updateCategory(activeCategory.id, data);
        setCategories((prev) =>
          prev.map((c) => (c.id === activeCategory.id ? updated : c))
        );
      }
      setModalMode(null);
      setActiveCategory(null);
    } catch (err) {
      console.error(err);
      alert("فشل حفظ الفئة.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل حذف الفئة. قد تكون مرتبطة بسيارات موجودة.");
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
              إدارة الفئات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              إضافة وتعديل وحذف فئات السيارات.
            </Text>
          </div>
          <button
            onClick={() => setModalMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={18} />
            فئة جديدة
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن فئة..."
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
            icon={<LayoutGrid size={28} />}
            title="لا توجد فئات"
            description="ابدأ بإضافة فئة سيارات جديدة."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((category) => (
              <div
                key={category.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                  <LayoutGrid size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{category.name}</p>
                  {typeof category.carsCount === "number" && (
                    <p className="text-xs text-gray-400">{category.carsCount} سيارة</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setActiveCategory(category);
                      setModalMode("edit");
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(category)}
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

      <CategoryModal
        mode={modalMode}
        category={activeCategory}
        isLoading={saving}
        onClose={() => {
          setModalMode(null);
          setActiveCategory(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الفئة"
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