// ============================================================
// src/utils/user-service.ts
// خدمات API لكل صفحات المستخدم
// استخدام: apiClient من src/lib/api-client.ts
// ============================================================

import {apiClient} from "@/lib/api-client";
import type {
  Car,
  CarsFilters,
  PaginatedCars,
  Booking,
  CreateBookingDto,
  Payment,
  PaymentStats,
  SavedCard,
  UserProfile,
  UpdateProfileDto,
  Notification,
  LoyaltyInfo,
  Review,
  CreateReviewDto,
  Location,
  CouponValidation,
} from "@/types/user.types";

// ──────────────────── Cars ────────────────────
export const carsService = {
  /** جلب السيارات مع الفلاتر والـ Pagination
   *  يتعامل مع شكلين من الاستجابة:
   *  1. { data: Car[], total, page, totalPages }  <- NestJS paginated
   *  2. Car[]                                      <- array مباشر
   */
  getAll: async (filters: CarsFilters = {}): Promise<PaginatedCars> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") params.append(key, String(val));
    });
    const { data } = await apiClient.get<PaginatedCars | Car[]>(`/cars?${params}`);

    // الـ API رجّع مصفوفة مباشرة بدون pagination wrapper
    if (Array.isArray(data)) {
      return {
        data,
        total:      data.length,
        page:       filters.page  ?? 1,
        limit:      filters.limit ?? data.length,
        totalPages: 1,
      };
    }

    // الـ API رجّع paginated object
    return {
      data:       Array.isArray(data.data) ? data.data : [],
      total:      data.total      ?? 0,
      page:       data.page       ?? 1,
      limit:      data.limit      ?? (filters.limit ?? 9),
      totalPages: data.totalPages ?? 1,
    };
  },

  /** جلب سيارة واحدة بالـ ID أو Slug */
  getOne: async (idOrSlug: string): Promise<Car> => {
    const { data } = await apiClient.get<Car>(`/cars/${idOrSlug}`);
    return data;
  },

  /** جلب سيارات مشابهة */
  getSimilar: async (carId: string): Promise<Car[]> => {
    const { data } = await apiClient.get<Car[]>(`/cars/${carId}/similar`);
    return data;
  },
};

// ──────────────────── Reviews ────────────────────
export const reviewsService = {
  getCarReviews: async (carId: string): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(`/reviews/car/${carId}`);
    return data;
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    const { data } = await apiClient.post<Review>("/reviews", dto);
    return data;
  },
};

// ──────────────────── Bookings ────────────────────
export const bookingsService = {
  /** حجوزات المستخدم الحالي */
  getMy: async (status?: string): Promise<Booking[]> => {
    const params = status ? `?status=${status}` : "";
    const { data } = await apiClient.get<Booking[]>(`/bookings/my${params}`);
    return data;
  },

  /** تفاصيل حجز واحد */
  getOne: async (id: string): Promise<Booking> => {
    const { data } = await apiClient.get<Booking>(`/bookings/${id}`);
    return data;
  },

  /** إنشاء حجز جديد */
  create: async (dto: CreateBookingDto): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>("/bookings", dto);
    return data;
  },

  /** إلغاء حجز */
  cancel: async (id: string): Promise<void> => {
    await apiClient.patch(`/bookings/${id}/cancel`);
  },

  /** التحقق من صلاحية كوبون */
  validateCoupon: async (
    code: string,
    carId: string
  ): Promise<CouponValidation> => {
    const { data } = await apiClient.post<CouponValidation>(
      "/coupons/validate",
      { code, carId }
    );
    return data;
  },
};

// ──────────────────── Favorites ────────────────────
export const favoritesService = {
  getAll: async (): Promise<Car[]> => {
    const { data } = await apiClient.get<Car[]>("/favorites");
    return data;
  },

  add: async (carId: string): Promise<void> => {
    await apiClient.post(`/favorites/${carId}`);
  },

  remove: async (carId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${carId}`);
  },
};

// ──────────────────── Profile ────────────────────
export const profileService = {
  get: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>("/users/me");
    return data;
  },

  update: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>("/users/me", dto);
    return data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const form = new FormData();
    form.append("avatar", file);
    const { data } = await apiClient.patch<{ avatarUrl: string }>(
      "/users/me/avatar",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  uploadLicense: async (file: File): Promise<{ licenseUrl: string }> => {
    const form = new FormData();
    form.append("license", file);
    const { data } = await apiClient.patch<{ licenseUrl: string }>(
      "/users/me/license",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};

// ──────────────────── Notifications ────────────────────
export const notificationsService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get<Notification[]>("/notifications/my");
    return data;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch("/notifications/read-all");
  },
};

// ──────────────────── Payments ────────────────────
export const paymentsService = {
  getHistory: async (): Promise<Payment[]> => {
    const { data } = await apiClient.get<Payment[]>("/payments/my");
    return data;
  },

  getStats: async (): Promise<PaymentStats> => {
    const { data } = await apiClient.get<PaymentStats>("/payments/my/stats");
    return data;
  },

  /** بطاقات المحفوظة للـ one-click pay */
  getSavedCards: async (): Promise<SavedCard[]> => {
    const { data } = await apiClient.get<SavedCard[]>("/payments/cards");
    return data;
  },

  saveCard: async (paymentMethodId: string): Promise<SavedCard> => {
    const { data } = await apiClient.post<SavedCard>("/payments/cards", {
      paymentMethodId,
    });
    return data;
  },

  deleteCard: async (cardId: string): Promise<void> => {
    await apiClient.delete(`/payments/cards/${cardId}`);
  },

  setDefaultCard: async (cardId: string): Promise<void> => {
    await apiClient.patch(`/payments/cards/${cardId}/default`);
  },
};

// ──────────────────── Loyalty ────────────────────
export const loyaltyService = {
  getInfo: async (): Promise<LoyaltyInfo> => {
    const { data } = await apiClient.get<LoyaltyInfo>("/loyalty/me");
    return data;
  },
};

// ──────────────────── Locations ────────────────────
export const locationsService = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await apiClient.get<Location[]>("/locations");
    return data;
  },
};