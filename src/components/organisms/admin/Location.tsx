"use client";

import { useEffect, useState, useCallback } from "react";
import EmptyState from "@/components/molecules/Emptystate";
import ConfirmDialog from "@/components/molecules/Confirmdialog";
import StatusBadge from "@/components/molecules/Statusbadge";
import LocationModal, { type LocationModalMode } from "@/components/organisms/admin/Modal/LocationModal";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  type Location,
  type LocationFormData,
} from "@/utils/locations-service";
import { Search, Loader2, MapPin, Pencil, Trash2, Plus } from "lucide-react";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<LocationModalMode>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLocations();
      setLocations(data ?? []);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب المواقع. تأكد من اتصال الخادم.");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const filtered = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data: LocationFormData) => {
    setSaving(true);
    try {
      if (modalMode === "add") {
        const created = await createLocation(data);
        setLocations((prev) => [created, ...prev]);
      } else if (modalMode === "edit" && activeLocation) {
        const updated = await updateLocation(activeLocation.id, data);
        setLocations((prev) =>
          prev.map((l) => (l.id === activeLocation.id ? updated : l))
        );
      }
      setModalMode(null);
      setActiveLocation(null);
    } catch (err) {
      console.error(err);
      alert("فشل حفظ الموقع.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLocation(deleteTarget.id);
      setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("فشل حذف الموقع.");
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
              إدارة المواقع
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              إضافة وتعديل مواقع الاستلام والتسليم.
            </Text>
          </div>
          <button
            onClick={() => setModalMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={18} />
            موقع جديد
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم الموقع أو المدينة..."
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
            icon={<MapPin size={28} />}
            title="لا توجد مواقع"
            description="ابدأ بإضافة موقع استلام أو تسليم جديد."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((location) => (
              <div
                key={location.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{location.name}</p>
                      <p className="text-xs text-gray-400">{location.city}</p>
                    </div>
                  </div>
                  <StatusBadge
                    label={location.isActive ? "نشط" : "غير نشط"}
                    color={location.isActive ? "green" : "gray"}
                  />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {location.address}
                </p>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => {
                      setActiveLocation(location);
                      setModalMode("edit");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Pencil size={14} />
                    تعديل
                  </button>
                  <button
                    onClick={() => setDeleteTarget(location)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 size={14} />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LocationModal
        mode={modalMode}
        location={activeLocation}
        isLoading={saving}
        onClose={() => {
          setModalMode(null);
          setActiveLocation(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الموقع"
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