// ============================================================
// src/utils/user-service.ts
// خدمات API — مع endpoint discovery تلقائي
// ============================================================

import apiClient from "@/lib/api-client";
import type {
  Car, CarsFilters, PaginatedCars, Booking, CreateBookingDto,
  Payment, PaymentStats, SavedCard, UserProfile, UpdateProfileDto,
  Notification, LoyaltyInfo, Review, CreateReviewDto, Location, CouponValidation,
  LoyaltyTier,
} from "@/types/user.types";

// ──────────────────────────────────────────────────────────────
// Endpoint candidates — الـ API قد يستخدم أي من هذه المسارات
// الـ service يجرب الأول ثم يتراجع للتالي تلقائياً
// ──────────────────────────────────────────────────────────────
async function tryEndpoints<T>(candidates: string[]): Promise<T> {
  let lastError: unknown;
  for (const url of candidates) {
    try {
      const { data } = await apiClient.get<T>(url);
      return data;
    } catch (err: any) {
      // 404 = endpoint غير موجود → جرّب التالي
      // 401/403 = موجود لكن غير مصرّح → ارمِ الخطأ فوراً
      const status = err?.response?.status;
      if (status === 401 || status === 403) throw err;
      lastError = err;
    }
  }
  throw lastError;
}

// ──────────────────── Cars ────────────────────
export const carsService = {
  getAll: async (filters: CarsFilters = {}): Promise<PaginatedCars> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") params.append(key, String(val));
    });
    const qs = params.toString();
    const data = await tryEndpoints<PaginatedCars | Car[]>([
      `/cars?${qs}`,
      `/car?${qs}`,
    ]);

    // دالة تطبيع بيانات سيارة واحدة

    const normalizeCar = (car: any) => {
      const id   = car.id   ?? car._id ?? "";
      const slug = car.slug ?? id;          // slug = id إذا لم يكن الـ backend يرجع slug
      return {
        ...car,
        id,
        slug,
        images:      Array.isArray(car.images) ? car.images.filter(Boolean) : [],
        brand:       car.brand       ?? car.brandName               ?? "",
        category:    car.category    ?? car.categoryName            ?? "",
        status:      car.status      ?? "available",
        rating:      car.rating      ?? car.averageRating           ?? 0,
        pricePerDay: car.pricePerDay ?? car.price ?? car.dailyPrice ?? 0,
      };
    };

    if (Array.isArray(data)) {
      return {
        data: data.map(normalizeCar),
        total: data.length,
        page: filters.page ?? 1,
        limit: filters.limit ?? data.length,
        totalPages: 1,
      };
    }
    const items = Array.isArray((data as any).data) ? (data as any).data : [];
    return {
      data:       items.map(normalizeCar),
      total:      (data as any).total      ?? 0,
      page:       (data as any).page       ?? 1,
      limit:      (data as any).limit      ?? (filters.limit ?? 9),
      totalPages: (data as any).totalPages ?? 1,
    };
  },

  getOne: async (idOrSlug: string): Promise<Car> => {
    let raw: any;
    let successUrl = "";

    // "kamry-2026-19315f44" → نستخرج كل الأجزاء الممكنة كـ ID
    const parts = idOrSlug.split("-");

    // احتمالات الـ ID من الـ slug:
    // 1. الـ slug كاملاً (إذا دعمه الـ backend)
    // 2. آخر segment فقط (e.g. "19315f44")
    // 3. آخر 5 segments — UUID كامل (8-4-4-4-12)
    // 4. آخر جزئين مدموجَين
    // 5. رقم صحيح فقط (إذا كان الـ ID رقمياً)

    const lastSegment  = parts[parts.length - 1];
    const last5        = parts.slice(-5).join("-");   // UUID كامل محتمل
    const last2        = parts.slice(-2).join("-");
    const numericPart  = parts.find(p => /^\d+$/.test(p));

    const uniqueCandidates = [...new Set([
      `/cars/${idOrSlug}`,
      `/cars/${last5}`,
      `/cars/${lastSegment}`,
      `/cars/${last2}`,
      numericPart ? `/cars/${numericPart}` : null,
      `/car/${idOrSlug}`,
      `/car/${last5}`,
      `/car/${lastSegment}`,
    ].filter(Boolean))] as string[];

    let lastError: unknown;
    for (const url of uniqueCandidates) {
      try {
        const { data } = await apiClient.get(url);
        raw = data;
        successUrl = url;
        break;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) throw err;
        lastError = err;
      }
    }

    if (!raw) throw lastError;

    // الـ API قد يُرجع { data: Car } أو Car مباشرة
    const car = raw?.data ?? raw;

    if (!car?.id && !car?._id) {
      throw new Error(`Car not found or unexpected structure: ${idOrSlug}`);
    }

    return {
      ...car,
      id:           car.id           ?? car._id,
      images:       Array.isArray(car.images) ? car.images.filter(Boolean) : [],
      rating:       car.rating       ?? car.averageRating ?? 0,
      reviewsCount: car.reviewsCount ?? car.totalReviews  ?? 0,
      status:       car.status       ?? "available",
      pricePerDay:  car.pricePerDay  ?? car.price         ?? car.dailyPrice ?? 0,
      brand:        car.brand        ?? car.brandName     ?? "",
      category:     car.category     ?? car.categoryName  ?? "",
    };
  },

  getSimilar: async (carId: string): Promise<Car[]> => {
    try {
      const data = await tryEndpoints<Car[]>([
        `/cars/${carId}/similar`,
        `/cars?category=similar&exclude=${carId}`,
      ]);
      return Array.isArray(data) ? data : [];
    } catch {
      return []; // سيارات مشابهة اختيارية — لا تكسر الصفحة
    }
  },
};

// ──────────────────── Reviews ────────────────────
export const reviewsService = {
  getCarReviews: async (carId: string): Promise<Review[]> => {
    try {
      const data = await tryEndpoints<Review[]>([
        `/reviews/car/${carId}`,
        `/reviews?carId=${carId}`,
        `/cars/${carId}/reviews`,
      ]);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    const { data } = await apiClient.post<Review>("/reviews", dto);
    return data;
  },
};

// ──────────────────── Bookings ────────────────────
export const bookingsService = {
  getMy: async (status?: string): Promise<Booking[]> => {
    try {
      // ✅ /bookings/my هو المسار الصحيح
      const qs = status ? `?status=${status}` : "";
      const { data } = await apiClient.get(`/bookings/my${qs}`);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch {
      return [];
    }
  },

  getOne: async (id: string): Promise<Booking> => {
    const data = await tryEndpoints<Booking>([
      `/bookings/${id}`,
    ]);
    return data;
  },

  create: async (dto: CreateBookingDto): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>("/bookings", dto);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/bookings/${id}/cancel`);
    } catch {
      await apiClient.delete(`/bookings/${id}`);
    }
  },

  validateCoupon: async (code: string, carId: string): Promise<CouponValidation> => {
    try {
      const { data } = await apiClient.post<CouponValidation>("/coupons/validate", { code, carId });
      return data;
    } catch {
      return { valid: false, message: "خدمة الكوبون غير متاحة حالياً" };
    }
  },
};

// ──────────────────── Favorites ────────────────────
export const favoritesService = {
  getAll: async (): Promise<Car[]> => {
    try {
      const { data } = await apiClient.get("/favorites");
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch {
      return [];
    }
  },

  // الباك اند يدعم toggle فقط — نستخدمه للإضافة والحذف
  add: async (carId: string): Promise<void> => {
    await apiClient.post(`/favorites/${carId}/toggle`);
  },

  remove: async (carId: string): Promise<void> => {
    await apiClient.post(`/favorites/${carId}/toggle`);
  },
};

// ──────────────────── Profile ────────────────────
export const profileService = {
  get: async (): Promise<UserProfile> => {
    // /auth/me هو المسار الصحيح (يعمل مع admin و user)
    // /users/me يرجع 403 مع الـ admin role
    const { data: raw } = await apiClient.get("/auth/me");

    // تطبيع — حقول الـ API قد تختلف
    return {
      id:               raw.id               ?? raw._id             ?? "",
      fullName:         raw.fullName         ?? raw.name            ?? raw.full_name ?? "",
      email:            raw.email            ?? "",
      phone:            raw.phone            ?? raw.phoneNumber     ?? raw.mobile    ?? "",
      avatar:           raw.avatar           ?? raw.profileImage    ?? raw.image     ?? undefined,
      licenseUrl:       raw.licenseUrl       ?? raw.license         ?? undefined,
      licenseExpiry:    raw.licenseExpiry    ?? undefined,
      loyaltyTier:      raw.loyaltyTier      ?? raw.tier            ?? "bronze",
      loyaltyPoints:    raw.loyaltyPoints    ?? raw.points          ?? 0,
      twoFactorEnabled: raw.twoFactorEnabled ?? raw.twoFactor       ?? false,
      createdAt:        raw.createdAt        ?? raw.created_at      ?? new Date().toISOString(),
    };
  },

  update: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>("/users/me", dto);
    return data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const form = new FormData();
    form.append("avatar", file);
    const { data } = await apiClient.patch<{ avatarUrl: string }>(
      "/users/me/avatar", form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  uploadLicense: async (file: File): Promise<{ licenseUrl: string }> => {
    const form = new FormData();
    form.append("license", file);
    const { data } = await apiClient.patch<{ licenseUrl: string }>(
      "/users/me/license", form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};

// ──────────────────── Notifications ────────────────────
export const notificationsService = {
  // الباك اند يُفلتر بـ userId من الـ JWT تلقائياً
  getAll: async (): Promise<Notification[]> => {
    try {
      const { data } = await apiClient.get("/notifications", { params: { page: 1, limit: 50 } });
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.notifications)) return data.notifications;
      return [];
    } catch {
      return [];
    }
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
    try {
      // ✅ /payments/my هو المسار الصحيح
      const { data } = await apiClient.get("/payments/my");
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch {
      return [];
    }
  },

  getStats: async (): Promise<PaymentStats> => {
    try {
      const data = await tryEndpoints<PaymentStats>([
        "/payments/my/stats",
        "/payments/stats",
        "/payments/summary",
      ]);
      return data;
    } catch {
      return { totalSpent: 0, completedBookings: 0, totalSaved: 0, averageBooking: 0 };
    }
  },

  getSavedCards: async (): Promise<SavedCard[]> => {
    try {
      const data = await tryEndpoints<SavedCard[]>([
        "/payments/cards",
        "/payment-methods",
        "/users/me/cards",
      ]);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  saveCard: async (paymentMethodId: string): Promise<SavedCard> => {
    const { data } = await apiClient.post<SavedCard>("/payments/cards", { paymentMethodId });
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
// الـ backend لا يملك loyalty endpoint بعد
// نبني البيانات من الـ profile + قيم افتراضية
export const loyaltyService = {
  getInfo: async (): Promise<LoyaltyInfo> => {
    // حاول الـ endpoints الموجودة أولاً
    try {
      const raw = await tryEndpoints<any>([
        "/loyalty/me",
        "/loyalty",
        "/users/me/loyalty",
        "/points/me",
        "/points",
      ]);
      return {
        tier:             raw.tier             ?? raw.level           ?? "bronze",
        points:           raw.points           ?? raw.totalPoints     ?? raw.balance ?? 0,
        pointsToNextTier: raw.pointsToNextTier ?? raw.pointsToUpgrade ?? 500,
        nextTier:         raw.nextTier         ?? raw.nextLevel       ?? null,
        benefits:         Array.isArray(raw.benefits) ? raw.benefits : [],
        history:          Array.isArray(raw.history)  ? raw.history  :
                          Array.isArray(raw.transactions) ? raw.transactions : [],
      };
    } catch {
      // الـ endpoint غير موجود → ابنِ من الـ profile
      try {
        const profile = await profileService.get();
        const tier = profile.loyaltyTier ?? "bronze";
        const TIER_POINTS: Record<string, number> = {
          bronze: 0, silver: 500, gold: 1500, platinum: 5000,
        };
        const TIER_NEXT: Record<string, string | null> = {
          bronze: "silver", silver: "gold", gold: "platinum", platinum: null,
        };
        const TIER_BENEFITS: Record<string, string[]> = {
          bronze:   ["خصم 5% على كل حجز", "نقطة لكل 10 ر.س", "دعم عبر البريد"],
          silver:   ["خصم 10% على كل حجز", "نقطتان لكل 10 ر.س", "دعم ذو أولوية", "ترقية مجانية مرة/شهر"],
          gold:     ["خصم 15% على كل حجز", "3 نقاط لكل 10 ر.س", "دعم على مدار الساعة", "ترقية مجانية دائماً", "سيارة بديلة مجانية"],
          platinum: ["خصم 20% على كل حجز", "5 نقاط لكل 10 ر.س", "مدير حساب شخصي", "ترقية VIP دائماً", "توصيل السيارة للباب", "كاشباك 2%"],
        };
        const points = profile.loyaltyPoints ?? TIER_POINTS[tier] ?? 0;
        const nextTier = TIER_NEXT[tier] as LoyaltyTier | null;
        const nextPoints = nextTier ? (TIER_POINTS[nextTier] ?? 500) : 0;
        return {
          tier:             tier as LoyaltyTier,
          points,
          pointsToNextTier: Math.max(0, nextPoints - points),
          nextTier,
          benefits:         TIER_BENEFITS[tier] ?? [],
          history:          [],
        };
      } catch {
        // آخر fallback — بيانات ثابتة
        return {
          tier: "bronze",
          points: 0,
          pointsToNextTier: 500,
          nextTier: "silver",
          benefits: ["خصم 5% على كل حجز", "نقطة لكل 10 ر.س", "دعم عبر البريد"],
          history: [],
        };
      }
    }
  },
};

// ──────────────────── Locations ────────────────────
export const locationsService = {
  getAll: async (): Promise<Location[]> => {
    try {
      const data = await tryEndpoints<Location[]>([
        "/locations",
        "/location",
        "/branches",
      ]);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
};