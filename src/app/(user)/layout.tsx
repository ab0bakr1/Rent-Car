// ============================================================
// src/app/(user)/layout.tsx
// Layout مشترك لكل صفحات المستخدم
// يستخدم Routes.ts لكل الروابط — لا paths مكتوبة يدوياً
// ============================================================
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Car, ListChecks, Heart, User, Bell, CreditCard, Crown, Menu, X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNotifications, useProfile } from "@/hooks/user/useUserQueries";
import { VipBadge } from "@/components/atoms/VipBadge";
import { getPath } from "@/utils/routes";
import { cn } from "@/lib/cn";

// ─── عناصر القائمة ────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "Cars"              as const, label: "تصفح السيارات",  Icon: Car        },
  { key: "MyBookings"        as const, label: "حجوزاتي",         Icon: ListChecks },
  { key: "Favorites"         as const, label: "المفضلات",         Icon: Heart      },
  { key: "Profile"           as const, label: "الملف الشخصي",    Icon: User       },
  { key: "UserNotifications" as const, label: "الإشعارات",       Icon: Bell       },
  { key: "Payments"          as const, label: "المدفوعات",        Icon: CreditCard },
  { key: "Loyalty"           as const, label: "برنامج الولاء",   Icon: Crown      },
];

const BOTTOM_NAV = [
  { key: "Cars"       as const, Icon: Car,        label: "السيارات" },
  { key: "MyBookings" as const, Icon: ListChecks,  label: "حجوزاتي"  },
  { key: "Favorites"  as const, Icon: Heart,       label: "المفضلة"  },
  { key: "Profile"    as const, Icon: User,        label: "حسابي"    },
];

// ─── SidebarItem ──────────────────────────────────────────────
function SidebarItem({
  path, label, Icon, isActive, badge,
}: {
  path: string; label: string; Icon: typeof Car;
  isActive: boolean; badge?: number;
}) {
  return (
    <Link
      href={path}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 transition-all text-sm font-medium",
        isActive
          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

// ─── Layout ───────────────────────────────────────────────────
export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const { data: profile } = useProfile();
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const navItems  = NAV_ITEMS.map((i)  => ({ ...i, path: getPath(i.key) }));
  const btmItems  = BOTTOM_NAV.map((i) => ({ ...i, path: getPath(i.key) }));
  const carsPath  = getPath("Cars");
  const notifPath = getPath("UserNotifications");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex" dir="rtl">

      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex flex-col w-56 fixed top-0 end-0 h-full bg-white dark:bg-gray-900 border-s border-gray-100 dark:border-gray-800 z-30">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <Link href={carsPath} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">RentCar</span>
          </Link>
        </div>
        {profile && (
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                {profile.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{profile.fullName}</p>
                <VipBadge tier={profile.loyaltyTier} size="sm" showLabel={false} />
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ key, path, label, Icon }) => (
            <SidebarItem
              key={key} path={path} label={label} Icon={Icon}
              isActive={pathname === path || pathname.startsWith(path + "/")}
              badge={key === "UserNotifications" ? unreadCount : undefined}
            />
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 text-center">RentCar © 2025</p>
        </div>
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Mobile sidebar ── */}
      <aside className={cn(
        "fixed top-0 end-0 h-full w-56 bg-white dark:bg-gray-900 z-50 transition-transform duration-300 lg:hidden",
        sidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-bold text-gray-900 dark:text-white text-sm">القائمة</span>
          <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <nav className="py-3 space-y-0.5">
          {navItems.map(({ key, path, label, Icon }) => (
            <SidebarItem
              key={key} path={path} label={label} Icon={Icon}
              isActive={pathname === path || pathname.startsWith(path + "/")}
              badge={key === "UserNotifications" ? unreadCount : undefined}
            />
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 lg:pe-56 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <Link href={carsPath} className="font-bold text-gray-900 dark:text-white text-sm">RentCar</Link>
          <Link href={notifPath} className="relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -end-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>

        <div className="p-4 lg:p-6 max-w-5xl mx-auto">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex z-20">
          {btmItems.map(({ key, path, Icon, label }) => (
            <Link key={key} href={path}
              className={cn(
                "flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors",
                pathname === path || pathname.startsWith(path + "/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="lg:hidden h-16" />
      </main>
    </div>
  );
}