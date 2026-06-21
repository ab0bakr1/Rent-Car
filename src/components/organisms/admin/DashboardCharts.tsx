"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2, TrendingUp, CalendarRange, Trophy, PieChart as PieIcon } from "lucide-react";
import {
  getRevenueChart,
  getBookingsChart,
  getTopCars,
  getCarsByCategory,
  type RevenueChartPoint,
  type BookingsChartPoint,
  type TopCarPoint,
  type CategoryDistributionPoint,
} from "@/utils/dashboard-charts-service";

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-blue-500">{icon}</span>
        <h3 className="font-bold text-gray-900 dark:text-white text-right">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ChartLoading() {
  return (
    <div className="flex items-center justify-center h-[260px]">
      <Loader2 className="animate-spin text-blue-400" size={28} />
    </div>
  );
}

export default function DashboardCharts() {
  const [revenue, setRevenue] = useState<RevenueChartPoint[] | null>(null);
  const [bookings, setBookings] = useState<BookingsChartPoint[] | null>(null);
  const [topCars, setTopCars] = useState<TopCarPoint[] | null>(null);
  const [categories, setCategories] = useState<CategoryDistributionPoint[] | null>(null);

  useEffect(() => {
    getRevenueChart().then(setRevenue).catch(() => setRevenue([]));
    getBookingsChart().then(setBookings).catch(() => setBookings([]));
    getTopCars().then(setTopCars).catch(() => setTopCars([]));
    getCarsByCategory().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8" dir="ltr">
      {/* إيرادات 12 شهر */}
      <ChartCard title="الإيرادات (آخر 12 شهر)" icon={<TrendingUp size={18} />}>
        {revenue === null ? (
          <ChartLoading />
        ) : revenue.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-16">لا توجد بيانات كافية</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "الإيرادات"]}
                contentStyle={{ borderRadius: 12, fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* حجوزات 6 أشهر */}
      <ChartCard title="الحجوزات (آخر 6 أشهر)" icon={<CalendarRange size={18} />}>
        {bookings === null ? (
          <ChartLoading />
        ) : bookings.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-16">لا توجد بيانات كافية</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bookings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                formatter={(value: number) => [value, "حجوزات"]}
                contentStyle={{ borderRadius: 12, fontSize: 13 }}
              />
              <Bar dataKey="bookings" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* أفضل السيارات */}
      <ChartCard title="أفضل السيارات أداءً" icon={<Trophy size={18} />}>
        {topCars === null ? (
          <ChartLoading />
        ) : topCars.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-16">لا توجد بيانات كافية</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCars} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => [value, "عدد الحجوزات"]}
                contentStyle={{ borderRadius: 12, fontSize: 13 }}
              />
              <Bar dataKey="bookingsCount" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* توزيع الفئات */}
      <ChartCard title="توزيع السيارات على الفئات" icon={<PieIcon size={18} />}>
        {categories === null ? (
          <ChartLoading />
        ) : categories.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-16">لا توجد بيانات كافية</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(props: { category?: string; percent?: number }) =>
                  `${props.category ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categories.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}