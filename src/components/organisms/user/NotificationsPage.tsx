// ============================================================
// src/components/organisms/user/NotificationsPage.tsx
// صفحة الإشعارات — /notifications
// مميزات: قسم "عروض حصرية لك" للـ VIP
// ============================================================
"use client";

import { useState } from "react";
import { Bell, Tag, Calendar, Star, CheckCheck, Crown } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useProfile,
} from "@/hooks/user/useUserQueries";
import { NotificationsSkeleton } from "@/components/atoms/skeletons";
import { VipBadge } from "@/components/atoms/VipBadge";
import { cn } from "@/lib/cn";
import type { NotificationType } from "@/types/user.types";

// ─── أيقونة الإشعار حسب النوع ─────────────────────────────
const NOTIF_ICON_MAP: Record<
  NotificationType,
  { Icon: typeof Bell; className: string }
> = {
  booking:  { Icon: Calendar, className: "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400" },
  reminder: { Icon: Bell,     className: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400" },
  promo:    { Icon: Tag,      className: "bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400" },
  review:   { Icon: Star,     className: "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400" },
  system:   { Icon: Bell,     className: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" },
};

export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { data: profile } = useProfile();
  const markRead    = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "vip">("all");

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;
  const vipNotifs   = notifications?.filter((n) => n.type === "promo") ?? [];

  // فلترة حسب التبويب
  const displayed =
    activeTab === "unread"
      ? (notifications ?? []).filter((n) => !n.isRead)
      : activeTab === "vip"
      ? vipNotifs
      : (notifications ?? []);

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الإشعارات</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{unreadCount} غير مقروءة</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 
                       border border-blue-200 dark:border-blue-800 px-3 h-8 rounded-xl transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "all",    label: "الكل" },
          { key: "unread", label: `غير مقروء (${unreadCount})` },
          { key: "vip",    label: "🎁 عروض حصرية" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={cn(
              "px-4 h-9 rounded-xl text-sm font-medium transition-all",
              activeTab === t.key
                ? t.key === "vip"
                  ? "bg-purple-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ✨ بانر عروض VIP */}
      {activeTab === "vip" && profile && (
        <div className="bg-gradient-to-l from-purple-600 to-purple-800 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-5 h-5 text-yellow-300" />
            <span className="font-bold">عروض حصرية لك</span>
            <VipBadge tier={profile.loyaltyTier} size="sm" />
          </div>
          <p className="text-sm text-purple-200">
            بصفتك عضواً مميزاً، تحصل على عروض لا تُتاح لغيرك.
            استمتع بها قبل انتهاء مدتها!
          </p>
        </div>
      )}

      {/* القائمة */}
      {isLoading ? (
        <NotificationsSkeleton />
      ) : !displayed.length ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <Bell className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">لا توجد إشعارات.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {displayed.map((notif) => {
            const { Icon, className } = NOTIF_ICON_MAP[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markRead.mutate(notif.id)}
                className={cn(
                  "flex gap-3 p-4 transition-colors",
                  !notif.isRead
                    ? "bg-blue-50/50 dark:bg-blue-950/10 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800",
                  // عروض VIP لها خلفية بنفسجية
                  notif.type === "promo" &&
                    "bg-purple-50/30 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                )}
              >
                {/* أيقونة */}
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0", className)}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* المحتوى */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm leading-snug",
                      !notif.isRead
                        ? "font-semibold text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    )}>
                      {notif.title}
                    </p>
                    {/* نقطة غير مقروء */}
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {notif.body}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <time className="text-xs text-gray-400">
                      {new Date(notif.createdAt).toLocaleString("ar-SA")}
                    </time>
                    {notif.type === "promo" && (
                      <span className="text-xs bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        حصري
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}