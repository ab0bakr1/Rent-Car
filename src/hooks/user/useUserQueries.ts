// ============================================================
// src/hooks/user/useUserQueries.ts
// React Query hooks لكل صفحات المستخدم
// ============================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  carsService,
  reviewsService,
  bookingsService,
  favoritesService,
  profileService,
  notificationsService,
  paymentsService,
  loyaltyService,
  locationsService,
} from "@/utils/user-service";
import type {
  CarsFilters,
  CreateBookingDto,
  CreateReviewDto,
  UpdateProfileDto,
} from "@/types/user.types";

// ─── Query Keys ──────────────────────────────────────────────
export const userKeys = {
  cars: (filters: CarsFilters) => ["cars", filters] as const,
  car: (id: string) => ["car", id] as const,
  carSimilar: (id: string) => ["car-similar", id] as const,
  carReviews: (id: string) => ["car-reviews", id] as const,
  myBookings: (status?: string) => ["my-bookings", status] as const,
  booking: (id: string) => ["booking", id] as const,
  favorites: ["favorites"] as const,
  profile: ["profile"] as const,
  notifications: ["notifications"] as const,
  paymentHistory: ["payment-history"] as const,
  paymentStats: ["payment-stats"] as const,
  savedCards: ["saved-cards"] as const,
  loyalty: ["loyalty"] as const,
  locations: ["locations"] as const,
};

// ─── Cars ────────────────────────────────────────────────────
export function useCars(filters: CarsFilters = {}) {
  return useQuery({
    queryKey: userKeys.cars(filters),
    queryFn: () => carsService.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 دقيقة
    retry: 1,
  });
}

export function useCar(idOrSlug: string) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: userKeys.car(idOrSlug),
    queryFn: async () => {
      // ─── 1: ابحث في الـ cache من صفحة /cars ─────────────────
      // slug "tahw-2026-db8b58c4" ← الـ backend يتوقع UUID الكامل
      // نجيب الـ car من الـ cache ونستخرج ID الحقيقي منه
      const allCaches = qc.getQueriesData<any>({ queryKey: ["cars"] });
      const shortId   = idOrSlug.split("-").slice(-1)[0]; // "db8b58c4"

      for (const [, cached] of allCaches) {
        if (!cached) continue;
        const items: any[] = Array.isArray(cached)
          ? cached
          : Array.isArray(cached?.data)
          ? cached.data
          : [];

        const found = items.find((car: any) =>
          car.slug === idOrSlug       ||
          car.id   === idOrSlug       ||
          car._id  === idOrSlug       ||
          String(car.id  ?? "").includes(shortId) ||
          String(car._id ?? "").includes(shortId) ||
          String(car.slug ?? "").includes(shortId)
        );

        if (found) {
          const realId = found.id ?? found._id;
          console.log("[useCar] ✅ found in cache — real ID:", realId);
          // إذا الـ ID الحقيقي مختلف عن الـ slug → أعد الجلب بالـ ID الصحيح
          if (realId && realId !== idOrSlug) {
            return carsService.getOne(realId);
          }
          return found;
        }
      }

      // ─── 2: جرب الـ API مباشرة ────────────────────────────────
      console.log("[useCar] not in cache, calling API with:", idOrSlug);
      return carsService.getOne(idOrSlug);
    },
    enabled: !!idOrSlug && idOrSlug !== "undefined",
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSimilarCars(carId: string) {
  return useQuery({
    queryKey: userKeys.carSimilar(carId),
    queryFn: () => carsService.getSimilar(carId),
    enabled: !!carId,
  });
}

// ─── Reviews ─────────────────────────────────────────────────
export function useCarReviews(carId: string) {
  return useQuery({
    queryKey: userKeys.carReviews(carId),
    queryFn: () => reviewsService.getCarReviews(carId),
    enabled: !!carId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewsService.create(dto),
    onSuccess: (_, { bookingId }) => {
      qc.invalidateQueries({ queryKey: userKeys.myBookings() });
    },
  });
}

// ─── Bookings ────────────────────────────────────────────────
export function useMyBookings(status?: string) {
  return useQuery({
    queryKey: userKeys.myBookings(status),
    queryFn: () => bookingsService.getMy(status),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: userKeys.booking(id),
    queryFn: () => bookingsService.getOne(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBookingDto) => bookingsService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.myBookings() });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.myBookings() });
    },
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, carId }: { code: string; carId: string }) =>
      bookingsService.validateCoupon(code, carId),
  });
}

// ─── Favorites ───────────────────────────────────────────────
export function useFavorites() {
  return useQuery({
    queryKey: userKeys.favorites,
    queryFn: favoritesService.getAll,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      carId,
      isFav,
    }: {
      carId: string;
      isFav: boolean;
    }) => (isFav ? favoritesService.remove(carId) : favoritesService.add(carId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.favorites });
    },
  });
}

// ─── Profile ─────────────────────────────────────────────────
export function useProfile() {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: profileService.get,
    staleTime: 1000 * 60 * 5,
    gcTime:    1000 * 60 * 15,
    retry: 1,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => profileService.update(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.profile }),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.profile }),
  });
}

export function useUploadLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profileService.uploadLicense(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.profile }),
  });
}

// ─── Notifications ───────────────────────────────────────────
export function useNotifications() {
  return useQuery({
    queryKey: userKeys.notifications,
    queryFn: notificationsService.getAll,
    refetchInterval: 1000 * 60, // كل دقيقة (بدل 30 ثانية)
    retry: 1,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userKeys.notifications }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsService.markAllRead,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userKeys.notifications }),
  });
}

// ─── Payments ────────────────────────────────────────────────
export function usePaymentHistory() {
  return useQuery({
    queryKey: userKeys.paymentHistory,
    queryFn: paymentsService.getHistory,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: userKeys.paymentStats,
    queryFn: paymentsService.getStats,
  });
}

export function useSavedCards() {
  return useQuery({
    queryKey: userKeys.savedCards,
    queryFn: paymentsService.getSavedCards,
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => paymentsService.deleteCard(cardId),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.savedCards }),
  });
}

export function useSetDefaultCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => paymentsService.setDefaultCard(cardId),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.savedCards }),
  });
}

// ─── Loyalty ─────────────────────────────────────────────────
export function useLoyalty() {
  return useQuery({
    queryKey: userKeys.loyalty,
    queryFn: loyaltyService.getInfo,
    retry: 1,                    // محاولة واحدة فقط بدل 3
    staleTime: 1000 * 60 * 5,   // 5 دقائق — لا يعيد الجلب عند العودة للصفحة
    gcTime:    1000 * 60 * 10,  // يحتفظ بالـ cache 10 دقائق
  });
}

// ─── Locations ───────────────────────────────────────────────
export function useLocations() {
  return useQuery({
    queryKey: userKeys.locations,
    queryFn: locationsService.getAll,
    staleTime: 1000 * 60 * 10, // 10 دقائق
  });
}