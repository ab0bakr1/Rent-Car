// ============================================================
// src/components/organisms/user/LoyaltyPage.tsx
// صفحة الولاء — /loyalty
// الإصلاحات:
// 1. فصل loading/error لكل query بشكل مستقل
// 2. عرض البيانات المتاحة فوراً بدون انتظار الكل
// 3. Fallback ذكي إذا لم يكن الـ endpoint موجوداً
// 4. retry: false لتجنب الانتظار الطويل
// ============================================================
"use client";

import { Crown, Gift, History, AlertCircle, RefreshCw } from "lucide-react";
import { useLoyalty, useProfile } from "@/hooks/user/useUserQueries";
import {
  VipBadge,
  LoyaltyPoints,
  TierProgress,
  TIER_CONFIG,
} from "@/components/atoms/VipBadge";
import { cn } from "@/lib/cn";
import type { LoyaltyTier, LoyaltyInfo } from "@/types/user.types";

// ─── Skeleton خفيف للقسم ─────────────────────────────────────
function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${i === 0 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}

// ─── بانر خطأ قابل لإعادة المحاولة ──────────────────────────
function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-sm">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        {message}
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-700 border border-red-200 dark:border-red-700 px-3 py-1.5 rounded-xl transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        إعادة المحاولة
      </button>
    </div>
  );
}

// ─── بطاقة مستوى ─────────────────────────────────────────────
function TierCard({ tier, isCurrent }: { tier: LoyaltyTier; isCurrent: boolean }) {
  const cfg = TIER_CONFIG[tier];

  const TIER_BENEFITS: Record<LoyaltyTier, string[]> = {
    bronze:   ["خصم 5% على كل حجز", "نقطة لكل 10 ر.س", "دعم عبر البريد"],
    silver:   ["خصم 10% على كل حجز", "نقطتان لكل 10 ر.س", "دعم ذو أولوية", "ترقية مجانية مرة/شهر"],
    gold:     ["خصم 15% على كل حجز", "3 نقاط لكل 10 ر.س", "دعم على مدار الساعة", "ترقية مجانية دائماً", "سيارة بديلة مجانية"],
    platinum: ["خصم 20% على كل حجز", "5 نقاط لكل 10 ر.س", "مدير حساب شخصي", "ترقية VIP دائماً", "توصيل السيارة للباب", "كاشباك 2%"],
  };

  return (
    <div className={cn(
      "rounded-2xl border p-5 transition-all",
      isCurrent
        ? `${cfg.bg} ${cfg.border} border-2 shadow-md`
        : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
    )}>
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
            <span className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
              isCurrent ? cfg.color.replace("text-", "bg-") : "bg-gray-300 dark:bg-gray-600"
            )} />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Fallback إذا لم يكن endpoint الولاء موجوداً ─────────────
function LoyaltyFallback({ tier }: { tier: LoyaltyTier }) {
  const TIERS: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];
  return (
    <div className="space-y-5">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        بيانات برنامج الولاء غير متاحة حالياً — يُعرض المستوى الحالي فقط
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">المستويات والمزايا</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((t) => <TierCard key={t} tier={t} isCurrent={tier === t} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export function LoyaltyPage() {
  const {
    data: loyalty,
    isLoading: loyaltyLoading,
    isError: loyaltyError,
    refetch: refetchLoyalty,
  } = useLoyalty();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useProfile();

  const TIERS: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];

  // ─── تحديد التير من الـ profile كـ fallback ───────────────
  const currentTier: LoyaltyTier = loyalty?.tier ?? profile?.loyaltyTier ?? "bronze";

  return (
    <div className="space-y-7">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">برنامج الولاء</h1>

      {/* ─── بانر الترحيب ─── */}
      <div className={cn(
        "rounded-2xl p-6 text-white relative overflow-hidden",
        currentTier === "platinum" ? "bg-gradient-to-l from-purple-700 to-purple-900"
        : currentTier === "gold"   ? "bg-gradient-to-l from-yellow-500 to-yellow-700"
        : currentTier === "silver" ? "bg-gradient-to-l from-gray-500 to-gray-700"
        :                            "bg-gradient-to-l from-amber-600 to-amber-800"
      )}>
        {/* خلفية زخرفية */}
        <div className="absolute top-0 end-0 opacity-10 text-9xl leading-none select-none pointer-events-none">
          {TIER_CONFIG[currentTier].icon}
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium text-white/80">مرحباً،</span>
            </div>

            {/* الاسم — يظهر فوراً أو skeleton صغير */}
            {profileLoading ? (
              <div className="h-7 w-40 bg-white/20 rounded-xl animate-pulse mb-2" />
            ) : profileError ? (
              <p className="text-white/60 text-sm mb-2">تعذّر تحميل الاسم</p>
            ) : (
              <h2 className="text-xl font-bold mb-2">{profile?.fullName}</h2>
            )}

            {/* النقاط — تظهر فوراً أو skeleton */}
            {loyaltyLoading ? (
              <div className="h-6 w-32 bg-white/20 rounded-full animate-pulse" />
            ) : loyalty ? (
              <LoyaltyPoints points={loyalty.points} tier={loyalty.tier} />
            ) : (
              <p className="text-white/60 text-sm">النقاط غير متاحة</p>
            )}
          </div>

          <VipBadge tier={currentTier} size="lg" />
        </div>

        {/* شريط التقدم */}
        {loyaltyLoading ? (
          <div className="mt-5 h-12 bg-white/10 rounded-xl animate-pulse" />
        ) : loyalty?.nextTier ? (
          <div className="relative z-10 mt-5 bg-white/10 rounded-xl p-3">
            <TierProgress
              tier={loyalty.tier}
              points={loyalty.points}
              pointsToNextTier={loyalty.pointsToNextTier}
              nextTier={loyalty.nextTier}
            />
          </div>
        ) : null}
      </div>

      {/* ─── خطأ الـ loyalty مع زر إعادة المحاولة ─── */}
      {loyaltyError && !loyaltyLoading && (
        <ErrorBanner
          message="تعذّر تحميل بيانات الولاء"
          onRetry={() => refetchLoyalty()}
        />
      )}

      {/* ─── خطأ الـ profile مع زر إعادة المحاولة ─── */}
      {profileError && !profileLoading && (
        <ErrorBanner
          message="تعذّر تحميل بيانات الملف الشخصي"
          onRetry={() => refetchProfile()}
        />
      )}

      {/* ─── بطاقات المستويات — تظهر دائماً ─── */}
      <div>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
          المستويات والمزايا
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier) => (
            <TierCard key={tier} tier={tier} isCurrent={currentTier === tier} />
          ))}
        </div>
      </div>

      {/* ─── مزاياك الحالية ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Gift className="w-4 h-4 text-gray-400" />
          مزاياك الحالية
        </h2>

        {loyaltyLoading ? (
          <SectionSkeleton lines={4} />
        ) : loyalty?.benefits?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {loyalty.benefits.map((b, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl text-sm",
                  TIER_CONFIG[currentTier].bg,
                  TIER_CONFIG[currentTier].color
                )}
              >
                <span className="text-base">✓</span>
                {b}
              </div>
            ))}
          </div>
        ) : (
          // Fallback: عرض مزايا المستوى من TIER_CONFIG الثابتة
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {["خصم على كل حجز", "دعم ذو أولوية", "نقاط مكافأة", "عروض حصرية"].map((b, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl text-sm",
                  TIER_CONFIG[currentTier].bg,
                  TIER_CONFIG[currentTier].color
                )}
              >
                <span className="text-base">✓</span>
                {b}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── سجل النقاط ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-gray-100 dark:border-gray-800">
          <History className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">سجل النقاط</h2>
        </div>

        {loyaltyLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-1">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : !loyalty?.history?.length ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            لا توجد معاملات بعد.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800 px-5">
            {loyalty.history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold",
                    tx.type === "earned"
                      ? "bg-green-100 dark:bg-green-950/40 text-green-600"
                      : "bg-red-100 dark:bg-red-950/40 text-red-500"
                  )}>
                    {tx.type === "earned" ? "+" : "−"}
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{tx.description}</p>
                    <time className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString("ar-SA")}
                    </time>
                  </div>
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  tx.type === "earned"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-500 dark:text-red-400"
                )}>
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