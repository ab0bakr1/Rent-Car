// ============================================================
// src/components/atoms/VipBadge.tsx
// شارة VIP — تظهر في الملف الشخصي وبطاقات الحجز
// ============================================================
"use client";

import { Crown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LoyaltyTier } from "@/types/user.types";

// ─── Tier config ──────────────────────────────────────────────
export const TIER_CONFIG: Record<
  LoyaltyTier,
  { label: string; color: string; bg: string; border: string; icon: string }
> = {
  bronze: {
    label: "برونزي",
    color: "text-amber-700",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-300",
    icon: "🥉",
  },
  silver: {
    label: "فضي",
    color: "text-gray-500",
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-300",
    icon: "🥈",
  },
  gold: {
    label: "ذهبي",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    border: "border-yellow-400",
    icon: "🥇",
  },
  platinum: {
    label: "بلاتيني",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-400",
    icon: "💎",
  },
};

// ─── Props ───────────────────────────────────────────────────
interface VipBadgeProps {
  tier: LoyaltyTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────
export function VipBadge({
  tier,
  size = "md",
  showLabel = true,
  className,
}: VipBadgeProps) {
  const cfg = TIER_CONFIG[tier];

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        cfg.bg,
        cfg.color,
        cfg.border,
        sizeClasses[size],
        className
      )}
    >
      <span>{cfg.icon}</span>
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}

// ─── Points display ───────────────────────────────────────────
interface LoyaltyPointsProps {
  points: number;
  tier: LoyaltyTier;
}

export function LoyaltyPoints({ points, tier }: LoyaltyPointsProps) {
  const cfg = TIER_CONFIG[tier];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
        cfg.bg,
        cfg.border
      )}
    >
      <Crown className={cn("w-4 h-4", cfg.color)} />
      <span className={cn("text-sm font-semibold", cfg.color)}>
        {points.toLocaleString("ar-SA")} نقطة
      </span>
    </div>
  );
}

// ─── Progress to next tier ────────────────────────────────────
interface TierProgressProps {
  tier: LoyaltyTier;
  points: number;
  pointsToNextTier: number;
  nextTier: LoyaltyTier | null;
}

export function TierProgress({
  tier,
  points,
  pointsToNextTier,
  nextTier,
}: TierProgressProps) {
  const cfg = TIER_CONFIG[tier];
  const nextCfg = nextTier ? TIER_CONFIG[nextTier] : null;

  // حساب نسبة التقدم
  const totalNeeded = points + pointsToNextTier;
  const progressPct = Math.min((points / totalNeeded) * 100, 100);

  if (!nextTier) {
    return (
      <div className="text-center py-2">
        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
          💎 أنت في أعلى مستوى!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span className={cfg.color}>{cfg.label}</span>
        <span className={nextCfg?.color}>{nextCfg?.label}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            tier === "bronze" && "bg-amber-500",
            tier === "silver" && "bg-gray-400",
            tier === "gold" && "bg-yellow-500",
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 text-center">
        {pointsToNextTier.toLocaleString("ar-SA")} نقطة للوصول إلى{" "}
        {nextCfg?.label}
      </p>
    </div>
  );
}