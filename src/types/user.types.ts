// ============================================================
// src/types/user.types.ts
// أنواع TypeScript لصفحات المستخدم
// ============================================================

export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";
export type TransmissionType = "automatic" | "manual";
export type CarStatus = "available" | "rented" | "maintenance";
export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "refunded" | "pending" | "failed";
export type NotificationType = "booking" | "reminder" | "promo" | "review" | "system";
export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

// ──────────────────── Car ────────────────────
// brand قد يأتي كـ string أو كـ object من الـ API
export type BrandField = string | { id: string | number; name: string; logo?: string };

export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: BrandField;
  brandLogo?: string;
  // category قد يأتي كـ string أو object { id, name }
  category: string | { id: string | number; name: string };
  year: number;
  pricePerDay: number;
  status: CarStatus;
  transmission: TransmissionType;
  // fuelType قد يأتي بقيم مختلفة من الـ API
  fuelType: FuelType | string;
  seats: number;
  color: string;
  mileage?: number;
  // images قد تحتوي على strings فارغة
  images: string[];
  rating: number;
  reviewsCount: number;
  description?: string;
  features?: string[];
}

export interface CarsFilters {
  search?: string;
  brand?: string;
  category?: string;
  transmission?: TransmissionType;
  fuelType?: FuelType;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedCars {
  data: Car[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ──────────────────── Review ────────────────────
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  carId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment: string;
}

// ──────────────────── Booking ────────────────────
export interface Booking {
  id: string;
  car: Car;
  userId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation: string;
  status: BookingStatus;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentLast4?: string;
  createdAt: string;
}

export interface CreateBookingDto {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocationId: string;
  returnLocationId: string;
  couponCode?: string;
  savedCardId?: string;
}

// ──────────────────── Payment ────────────────────
export interface Payment {
  id: string;
  bookingId: string;
  car: Pick<Car, "id" | "name" | "brand">;
  amount: number;
  status: PaymentStatus;
  method: string;
  last4?: string;
  createdAt: string;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: string; // visa | mastercard | mada
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface PaymentStats {
  totalSpent: number;
  completedBookings: number;
  totalSaved: number;
  averageBooking: number;
}

// ──────────────────── User Profile ────────────────────
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  licenseUrl?: string;
  licenseExpiry?: string;
  loyaltyTier: LoyaltyTier;
  loyaltyPoints: number;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
}

// ──────────────────── Notification ────────────────────
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// ──────────────────── Loyalty ────────────────────
export interface LoyaltyInfo {
  tier: LoyaltyTier;
  points: number;
  pointsToNextTier: number;
  nextTier: LoyaltyTier | null;
  benefits: string[];
  history: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  type: "earned" | "redeemed";
  points: number;
  description: string;
  createdAt: string;
}

// ──────────────────── Location ────────────────────
export interface Location {
  id: string;
  name: string;
  city: string;
}

// ──────────────────── Coupon ────────────────────
export interface CouponValidation {
  valid: boolean;
  discountPercent?: number;
  message?: string;
}