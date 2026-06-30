import apiClient from "@/lib/api-client";

export interface RevenueChartPoint {
  month: string; // "Jan", "Feb"...
  revenue: number;
}

export interface BookingsChartPoint {
  month: string;
  bookings: number;
}

export interface TopCarPoint {
  carId: string;
  name: string;
  bookingsCount: number;
  revenue: number;
}

export interface CategoryDistributionPoint {
  category: string;
  count: number;
}

// إيرادات آخر 12 شهر
export async function getRevenueChart(): Promise<RevenueChartPoint[]> {
  const response = await apiClient.get("/admin/dashboard/revenue-chart");
  return response.data.data ?? response.data;
}

// عدد الحجوزات لآخر 6 أشهر
export async function getBookingsChart(): Promise<BookingsChartPoint[]> {
  const response = await apiClient.get("/admin/dashboard/bookings-chart");
  return response.data.data ?? response.data;
}

// أفضل السيارات أداءً
export async function getTopCars(): Promise<TopCarPoint[]> {
  const response = await apiClient.get("/admin/dashboard/top-cars");
  return response.data.data ?? response.data;
}

// توزيع السيارات على الفئات
export async function getCarsByCategory(): Promise<CategoryDistributionPoint[]> {
  const response = await apiClient.get("/admin/dashboard/cars-by-category");
  return response.data.data ?? response.data;
}