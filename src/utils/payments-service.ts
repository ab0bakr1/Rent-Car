import apiClient from "@/lib/api-client";
import type { PaginatedResponse } from "./bookings-service";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type PaymentMethod = "CARD" | "CASH" | "PAY_LATER" | "BANK_TRANSFER";

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  refundedAmount?: number | null;
  createdAt: string;
  booking: {
    id: string;
    bookingNumber: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  search?: string;
}

export interface RefundPayload {
  amount: number;
  reason?: string;
}

// جلب كل المدفوعات (للأدمن)
export async function getPayments(
  query: PaymentsQuery = {}
): Promise<PaginatedResponse<Payment>> {
  const response = await apiClient.get("/payments", { params: query });
  return response.data.data ? response.data : response.data;
}

// جلب تفاصيل دفعة واحدة
export async function getPaymentById(id: string): Promise<Payment> {
  const response = await apiClient.get(`/payments/${id}`);
  return response.data.data ?? response.data;
}

// استرجاع مبلغ (كامل أو جزئي)
export async function refundPayment(
  id: string,
  payload: RefundPayload
): Promise<Payment> {
  const response = await apiClient.patch(`/payments/${id}/refund`, payload);
  return response.data.data ?? response.data;
}