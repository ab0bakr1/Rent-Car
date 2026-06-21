import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "./bookings-service";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  adminReply?: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  car: {
    id: string;
    name: string;
    model: string;
  };
}

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  search?: string;
}

// جلب كل التقييمات (للأدمن)
export async function getReviews(
  query: ReviewsQuery = {}
): Promise<PaginatedResponse<Review>> {
  const response = await apiClient.get("/reviews", { params: query });
  return response.data.data ? response.data : response.data;
}

// الموافقة على تقييم
export async function approveReview(id: string): Promise<Review> {
  const response = await apiClient.patch(`/reviews/${id}/approve`);
  return response.data.data ?? response.data;
}

// رفض تقييم
export async function rejectReview(id: string): Promise<Review> {
  const response = await apiClient.patch(`/reviews/${id}/reject`);
  return response.data.data ?? response.data;
}

// الرد على تقييم
export async function replyToReview(id: string, reply: string): Promise<Review> {
  const response = await apiClient.patch(`/reviews/${id}/reply`, { reply });
  return response.data.data ?? response.data;
}