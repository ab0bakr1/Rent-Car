// ============================================================
// src/components/organisms/user/LoyaltyPage.tsx
// صفحة الولاء — /loyalty
// مميزات: المستويات، النقاط، المكافآت، سجل المعاملات
// ============================================================
"use client";

import { Crown, Gift, History, ChevronLeft } from "lucide-react";
import { useLoyalty, useProfile } from "@/hooks/user/useUserQueries";
import {
  VipBadge,
  LoyaltyPoints,
  TierProgress,
  TIER_CONFIG,
} from "@/components/atoms/VipBadge";
import { cn } from "@/lib/cn";
import type { LoyaltyTier } from "@/types/user.types";

// ─── بطاقة مستوى ─────────────────────────────────────────────
function TierCard({
  tier,
  isCurrent,
}: {
  tier: LoyaltyTier;
  isCurrent: boolean;
}) {
  const cfg = TIER_CONFIG[tier];

  const TIER_BENEFITS: Record<LoyaltyTier, string[]> = {
    bronze:   ["خصم 5% على كل حجز", "نقطة لكل 10 ر.س", "دعم عبر البريد"],
    silver:   ["خصم 10% على كل حجز", "نقطتان لكل 10 ر.س", "دعم ذو أولوية", "ترقية مجانية مرة/شهر"],
    gold:     ["خصم 15% على كل حجز", "3 نقاط لكل 10 ر.س", "دعم على مدار الساعة", "ترقية مجانية دائماً", "سيارة بديلة مجانية"],
    platinum: ["خصم 20% على كل حجز", "5 نقاط لكل 10 ر.س", "مدير حساب شخصي", "ترقية VIP دائماً", "توصيل السيارة للباب", "كاشباك 2%"],
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all",
        isCurrent
          ? `${cfg.bg} ${cfg.border} border-2 shadow-md`
          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cfg.icon}</span>
          <span className={cn("font-bold text-base", isCurrent ? cfg.color : "text-gray-700 dark:text-gray-200")}>
            {cfg.label}
          </span>
        </div>
        {isCurrent && (
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium border", cfg.bg, cfg.color, cfg.border)}>
            مستواك الحالي
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {TIER_BENEFITS[tier].map((b) => (
          <li key={b} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isCurrent ? cfg.color.replace("text-", "bg-") : "bg-gray-300 dark:bg-gray-600")} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────
export function LoyaltyPage() {
  const { data: loyalty, isLoading: loyaltyLoading } = useLoyalty();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const isLoading = loyaltyLoading || profileLoading;

  if (isLoading || !loyalty || !profile) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const TIERS: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];

  return (
    <div className="space-y-7">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        برنامج الولاء
      </h1>

      {/* ─── بانر الترحيب ─── */}
      <div
        className={cn(
          "rounded-2xl p-6 text-white relative overflow-hidden",
          loyalty.tier === "platinum"
            ? "bg-gradient-to-l from-purple-700 to-purple-900"
            : loyalty.tier === "gold"
            ? "bg-gradient-to-l from-yellow-500 to-yellow-700"
            : loyalty.tier === "silver"
            ? "bg-gradient-to-l from-gray-500 to-gray-700"
            : "bg-gradient-to-l from-amber-600 to-amber-800"
        )}
      >
        {/* خلفية زخرفية */}
        <div className="absolute top-0 end-0 opacity-10 text-9xl leading-none select-none pointer-events-none">
          {TIER_CONFIG[loyalty.tier].icon}
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/80">مرحباً،</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{profile.fullName}</h2>
            <LoyaltyPoints points={loyalty.points} tier={loyalty.tier} />
          </div>
          <VipBadge tier={loyalty.tier} size="lg" />
        </div>

        {/* شريط التقدم */}
        {loyalty.nextTier && (
          <div className="relative z-10 mt-5 bg-white/10 rounded-xl p-3">
            <TierProgress
              tier={loyalty.tier}
              points={loyalty.points}
              pointsToNextTier={loyalty.pointsToNextTier}
              nextTier={loyalty.nextTier}
            />
          </div>
        )}
      </div>

      {/* ─── بطاقات المستويات ─── */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
          المستويات والمزايا
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier) => (
            <TierCard
              key={tier}
              tier={tier}
              isCurrent={loyalty.tier === tier}
            />
          ))}
        </div>
      </div>

      {/* ─── مزايا المستوى الحالي ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Gift className="w-4 h-4 text-gray-400" />
          مزاياك الحالية
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {loyalty.benefits.map((b, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl text-sm",
                TIER_CONFIG[loyalty.tier].bg,
                TIER_CONFIG[loyalty.tier].color
              )}
            >
              <span className="text-base">✓</span>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* ─── سجل المعاملات ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-gray-100 dark:border-gray-800">
          <History className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            سجل النقاط
          </h2>
        </div>

        {!loyalty.history?.length ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            لا توجد معاملات بعد.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800 px-5">
            {loyalty.history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm",
                      tx.type === "earned"
                        ? "bg-green-100 dark:bg-green-950/40 text-green-600"
                        : "bg-red-100 dark:bg-red-950/40 text-red-500"
                    )}
                  >
                    {tx.type === "earned" ? "+" : "−"}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {tx.description}
                    </p>
                    <time className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString("ar-SA")}
                    </time>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-bold",
                    tx.type === "earned"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  )}
                >
                  {tx.type === "earned" ? "+" : "−"}
                  {tx.points.toLocaleString("ar-SA")} نقطة
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}