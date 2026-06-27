// ============================================================
// src/hooks/useNav.ts
// Hook للتنقل بين الصفحات باستخدام Routes.ts
// الاستخدام: const { go, goBack, href } = useNav();
// ============================================================
"use client";

import { useRouter } from "next/navigation";
import { buildPath, getPath, type RouteKey } from "@/utils/routes";

export function useNav() {
  const router = useRouter();

  /** الانتقال لصفحة بالـ key */
  function go(key: RouteKey, params?: Record<string, string>) {
    router.push(buildPath(key, params));
  }

  /** الرجوع للصفحة السابقة */
  function goBack() {
    router.back();
  }

  /** الحصول على الـ href فقط (للـ <Link>) */
  function href(key: RouteKey, params?: Record<string, string>) {
    return buildPath(key, params);
  }

  return { go, goBack, href, getPath };
}