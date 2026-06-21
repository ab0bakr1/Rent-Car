"use client";

import AdminSidebar from "../molecules/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen ds-bg-alt pt-24" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-10 lg:py-12">
        {children}
      </main>
    </div>
  );
}