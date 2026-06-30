import apiClient from "@/lib/api-client";

export type CouponType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  maxUses?: number | null;
  usedCount: number;
  minBookingAmount?: number | null;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CouponFormData {
  code: string;
  type: CouponType;
  value: number;
  maxUses?: number | null;
  minBookingAmount?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

export async function getCoupons(): Promise<Coupon[]> {
  const response = await apiClient.get("/coupons");
  return response.data.data ?? response.data;
}

export async function createCoupon(payload: CouponFormData): Promise<Coupon> {
  const { isActive, maxUses, ...rest } = payload;
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const response = await apiClient.post("/coupons", clean);
  return response.data.data ?? response.data;
}

export async function updateCoupon(id: string, payload: CouponFormData): Promise<Coupon> {
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const response = await apiClient.patch(`/coupons/${id}`, clean);
  return response.data.data ?? response.data;
}

export async function deleteCoupon(id: string): Promise<void> {
  await apiClient.delete(`/coupons/${id}`);
}