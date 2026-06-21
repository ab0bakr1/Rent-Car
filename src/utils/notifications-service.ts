import { apiClient } from "@/lib/api-client";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SendNotificationPayload {
  title: string;
  message: string;
  // فاضي = إرسال لكل المستخدمين
  userIds?: string[];
}

export interface PaginatedNotifications {
  data: NotificationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// جلب كل الإشعارات المرسلة (للأدمن)
export async function getNotifications(page = 1, limit = 20): Promise<PaginatedNotifications> {
  const response = await apiClient.get("/notifications", { params: { page, limit } });
  return response.data.data ? response.data : response.data;
}

// إرسال إشعار جديد لمستخدم أو لكل المستخدمين
export async function sendNotification(payload: SendNotificationPayload): Promise<void> {
  await apiClient.post("/notifications", payload);
}