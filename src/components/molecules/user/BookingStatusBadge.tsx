// ============================================================
// src/components/molecules/user/BookingStatusBadge.tsx
// شارة حالة الحجز — تُستخدم في كل صفحات الحجوزات
// ============================================================
"use client";

import { cn } from "@/lib/cn";
import type { BookingStatus, PaymentStatus } from "@/types/user.types";

// ─── Booking Status ───────────────────────────────────────────
const BOOKING_STATUS_MAP: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending:   { label: "قيد المراجعة", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
  confirmed: { label: "مؤكد",         className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400" },
  active:    { label: "نشط",          className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400" },
  completed: { label: "منتهي",        className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" },
  cancelled: { label: "ملغي",         className: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" },
};

// ─── Payment Status ───────────────────────────────────────────
const PAYMENT_STATUS_MAP: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  paid:     { label: "مدفوع",    className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" },
  refunded: { label: "مسترجع",   className: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" },
  pending:  { label: "قيد الدفع", className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" },
  failed:   { label: "فشل",      className: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" },
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

export function BookingStatusBadge({
  status,
  size = "md",
}: BookingStatusBadgeProps) {
  const { label, className } = BOOKING_STATUS_MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className
      )}
    >
      {label}
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md";
}

export function PaymentStatusBadge({
  status,
  size = "sm",
}: PaymentStatusBadgeProps) {
  const { label, className } = PAYMENT_STATUS_MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className
      )}
    >
      {label}
    </span>
  );
}