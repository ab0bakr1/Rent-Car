"use client";

import { useEffect, useState } from "react";
import Title from "../../atoms/Title";
import Text from "../../atoms/Text";
import Link from "next/link";
import {
  CarFront, Banknote, PlusCircle, Users,
  ShieldCheck, Loader2, CalendarCheck, Star,
  MapPin, Clock
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/utils/cars-service";
import DashboardCharts from "@/components/organisms/admin/DashboardCharts";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("فشل في جلب الإحصائيات. يتم عرض بيانات تجريبية.");
        setStats({
          cars: { total: 24, available: 24, booked: 0 },
          users: { total: 7, newThisMonth: 7 },
          bookings: { total: 4, thisMonth: 4, pending: 1, active: 0, completed: 2 },
          revenue: { total: 11117.5, thisMonth: 11117.5, lastMonth: 0, growth: 100 },
          pendingReviews: 1,
          totalLocations: 4,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Title variant="primary" size="xl" className="mb-2 text-right">
            لوحة تحكم الإدارة
          </Title>
          <Text size="md" variant="secondary" className="!pt-0 text-right">
            مرحباً بك في لوحة التحكم الخاصة بالمديرين فقط.
          </Text>
        </div>
        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full font-medium">
          <ShieldCheck size={20} />
          <span>مدير النظام</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 font-medium text-center">
          {error}
        </div>
      )}

      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="إجمالي السيارات"
          value={stats?.cars.total}
          sub={`${stats?.cars.available} متاحة`}
          icon={<CarFront size={28} />}
          color="blue"
        />
        <StatCard
          label="إجمالي المستخدمين"
          value={stats?.users.total}
          sub={`${stats?.users.newThisMonth} هذا الشهر`}
          icon={<Users size={28} />}
          color="purple"
        />
        <StatCard
          label="الحجوزات"
          value={stats?.bookings.total}
          sub={`${stats?.bookings.pending} معلّقة`}
          icon={<CalendarCheck size={28} />}
          color="green"
        />
        <StatCard
          label="إجمالي الإيرادات"
          value={`$${stats?.revenue.total.toLocaleString()}`}
          sub={`نمو ${stats?.revenue.growth}%`}
          icon={<Banknote size={28} />}
          color="yellow"
        />
      </div>

      {/* بطاقات ثانوية */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MiniCard
          label="مراجعات معلّقة"
          value={stats?.pendingReviews}
          icon={<Star size={20} />}
          color="orange"
        />
        <MiniCard
          label="المواقع"
          value={stats?.totalLocations}
          icon={<MapPin size={20} />}
          color="teal"
        />
        <MiniCard
          label="حجوزات مكتملة"
          value={stats?.bookings.completed}
          icon={<Clock size={20} />}
          color="gray"
        />
      </div>

      {/* الرسوم البيانية */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-right">
        نظرة تحليلية
      </h3>
      <DashboardCharts />

      {/* إجراءات سريعة */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-right">
        إجراءات سريعة
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/AddCars" className="group block p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
            <PlusCircle size={32} />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">إضافة سيارة جديدة</h4>
          <p className="text-gray-500 dark:text-gray-400">قم بإضافة وتوثيق سيارات جديدة إلى الأسطول.</p>
        </Link>

        <Link href="/Staff" className="group block p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 flex items-center justify-center text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-4">
            <Users size={32} />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">إدارة الموظفين</h4>
          <p className="text-gray-500 dark:text-gray-400">إضافة، تعديل، وإدارة صلاحيات الموظفين في النظام.</p>
        </Link>
      </div>

      {/* روابط سريعة لأقسام الإدارة */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-8 text-right">
        أقسام الإدارة
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <QuickLink href="/BookingsPage" label="الحجوزات" icon={<CalendarCheck size={20} />} />
        <QuickLink href="/PaymentsPage" label="المدفوعات" icon={<Banknote size={20} />} />
        <QuickLink href="/ReviewsPage" label="التقييمات" icon={<Star size={20} />} />
        <QuickLink href="/BrandsPage" label="الماركات" icon={<CarFront size={20} />} />
        <QuickLink href="/CategoriesPage" label="الفئات" icon={<CarFront size={20} />} />
        <QuickLink href="/LocationsPage" label="المواقع" icon={<MapPin size={20} />} />
        <QuickLink href="/CouponsPage" label="الكوبونات" icon={<Banknote size={20} />} />
        <QuickLink href="/NotificationsPage" label="الإشعارات" icon={<Star size={20} />} />
      </div>

    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// مكوّنات مساعدة
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const colorMap = {
  blue:   { bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-600 dark:text-blue-400" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
  green:  { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-600 dark:text-green-400" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  teal:   { bg: "bg-teal-100 dark:bg-teal-900/30",     text: "text-teal-600 dark:text-teal-400" },
  gray:   { bg: "bg-gray-100 dark:bg-gray-800",        text: "text-gray-600 dark:text-gray-400" },
};

function StatCard({
  label, value, sub, icon, color,
}: {
  label: string;
  value: string | number | undefined;
  sub?: string;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
}) {
  const { bg, text } = colorMap[color];
  return (
    <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-1">
      <div className="text-right">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className={`text-3xl font-bold ${text}`}>{value ?? "—"}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center ${text}`}>
        {icon}
      </div>
    </div>
  );
}

function MiniCard({
  label, value, icon, color,
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
}) {
  const { bg, text } = colorMap[color];
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center ${text} shrink-0`}>
        {icon}
      </div>
      <div className="text-right flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-xl font-bold ${text}`}>{value ?? "—"}</p>
      </div>
    </div>
  );
}

function QuickLink({
  href, label, icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
    >
      <span className="text-blue-500 shrink-0">{icon}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{label}</span>
    </Link>
  );
}