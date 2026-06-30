import apiClient from "@/lib/api-client";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  car: {
    id: string;
    name: string;
    model: string;
    mainImage?: string | null;
  };
}

export interface BookingsQuery {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// جلب كل الحجوزات (للأدمن) مع فلاتر وترقيم صفحات
export async function getBookings(
  query: BookingsQuery = {}
): Promise<PaginatedResponse<Booking>> {
  const response = await apiClient.get("/bookings", { params: query });
  return response.data.data ? response.data : response.data;
}

// جلب تفاصيل حجز واحد
export async function getBookingById(id: string): Promise<Booking> {
  const response = await apiClient.get(`/bookings/${id}`);
  return response.data.data ?? response.data;
}

// تحديث حالة الحجز (PENDING -> CONFIRMED -> ACTIVE -> COMPLETED, أو CANCELLED)
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking> {
  const response = await apiClient.patch(`/bookings/${id}/status`, { status });
  return response.data.data ?? response.data;
}