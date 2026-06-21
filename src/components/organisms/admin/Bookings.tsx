"use client";

import { useEffect, useState, useCallback } from "react";
import StatusBadge from "@/components/molecules/Statusbadge";
import Pagination from "@/components/molecules/Pagination";
import EmptyState from "@/components/molecules/Emptystate";
import Title from "@/components/atoms/Title";
import Text from "@/components/atoms/Text";
import {
  getBookings,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/utils/bookings-service";
import {
  Search,
  Loader2,
  CalendarCheck,
  User,
  CarFront,
  ChevronDown,
} from "lucide-react";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: "green" | "yellow" | "red" | "blue" | "gray" }
> = {
  PENDING: { label: "معلّقة", color: "yellow" },
  CONFIRMED: { label: "مؤكدة", color: "blue" },
  ACTIVE: { label: "نشطة", color: "green" },
  COMPLETED: { label: "مكتملة", color: "gray" },
  CANCELLED: { label: "ملغاة", color: "red" },
};

const STATUS_OPTIONS: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBookings({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });
      setBookings(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setError("فشل في جلب الحجوزات. تأكد من اتصال الخادم.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
      alert("فشل تحديث حالة الحجز.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
        {/* الهيدر */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Title variant="primary" size="xl" className="mb-1 text-right">
              إدارة الحجوزات
            </Title>
            <Text size="md" variant="secondary" className="!pt-0 text-right">
              عرض كل الحجوزات وتحديث حالاتها.
            </Text>
          </div>
        </div>

        {/* الفلاتر */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="بحث برقم الحجز أو اسم العميل..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value as BookingStatus | "");
            }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">كل الحالات</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 font-medium text-center">
            {error}
          </div>
        )}

        {/* المحتوى */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck size={28} />}
            title="لا توجد حجوزات"
            description="لم يتم العثور على حجوزات مطابقة لبحثك."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">رقم الحجز</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      #{booking.bookingNumber}
                    </p>
                  </div>
                  <StatusBadge
                    label={STATUS_CONFIG[booking.status].label}
                    color={STATUS_CONFIG[booking.status].color}
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User size={15} className="shrink-0" />
                    <span className="truncate">
                      {booking.user.firstName} {booking.user.lastName} — {booking.user.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CarFront size={15} className="shrink-0" />
                    <span className="truncate">
                      {booking.car.name} {booking.car.model}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarCheck size={15} className="shrink-0" />
                    <span dir="ltr">
                      {new Date(booking.startDate).toLocaleDateString()} →{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    ${booking.totalAmount.toLocaleString()}
                  </p>

                  <div className="relative">
                    <select
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value as BookingStatus)
                      }
                      className="appearance-none pr-8 pl-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    {updatingId === booking.id && (
                      <Loader2
                        size={14}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
  );
}