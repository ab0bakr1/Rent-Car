"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  CalendarCheck,
  Banknote,
  Star,
  Tag,
  LayoutGrid,
  MapPin,
  TicketPercent,
  Bell,
  Users,
  CarFront,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "لوحة التحكم", href: "/Dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "السيارات", href: "/CarsPage", icon: <CarFront size={20} /> },
  { label: "الحجوزات", href: "/BookingsPage", icon: <CalendarCheck size={20} /> },
  { label: "المدفوعات", href: "/PaymentsPage", icon: <Banknote size={20} /> },
  { label: "التقييمات", href: "/ReviewsPage", icon: <Star size={20} /> },
  { label: "الماركات", href: "/BrandsPage", icon: <Tag size={20} /> },
  { label: "الفئات", href: "/CategoriesPage", icon: <LayoutGrid size={20} /> },
  { label: "المواقع", href: "/LocationsPage", icon: <MapPin size={20} /> },
  { label: "الكوبونات", href: "/CouponsPage", icon: <TicketPercent size={20} /> },
  { label: "الإشعارات", href: "/NotificationsPage", icon: <Bell size={20} /> },
  { label: "الموظفين", href: "/Staff", icon: <Users size={20} /> },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname?.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
      )}
    >
      <span className={cn(isActive && "text-blue-600 dark:text-blue-400")}>
        {item.icon}
      </span>
      <span>{item.label}</span>
      {isActive && <ChevronLeft size={16} className="mr-auto" />}
    </Link>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* زر فتح القائمة في الموبايل - تحت الـ Navbar الثابت مباشرة */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-24 right-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
        aria-label="فتح القائمة"
      >
        <Menu size={20} className="text-gray-700 dark:text-gray-300" />
      </button>

      {/* خلفية معتمة عند فتح القائمة في الموبايل */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* القائمة الجانبية - sticky تحت الـ Navbar، نفس نقطة توقف الـ breakpoint بتاعته (md) */}
      <aside
        dir="rtl"
        className={cn(
          "fixed top-24 right-0 z-50 h-[calc(100vh-6rem)] w-72 shrink-0 border-l border-gray-200 dark:border-gray-800 ds-bg flex flex-col transition-transform duration-300 md:sticky md:translate-x-0",
          mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        {/* الشعار */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CarFront size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                Rent a Car
              </p>
              <p className="text-xs text-gray-400">لوحة الإدارة</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* الروابط */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={() => setMobileOpen(false)} />
          ))}
        </nav>

        {/* تذييل */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={18} />
            العودة للموقع
          </Link>
        </div>
      </aside>
    </>
  );
}