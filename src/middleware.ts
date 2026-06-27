// ============================================================
// src/middleware.ts
// ملاحظة مهمة من README:
// - الـ accessToken يُخزَّن في-memory أو js-cookie (ليس httpOnly)
// - الـ refreshToken فقط هو httpOnly Cookie
// - المشروع يعتمد AdminGuard.tsx و AdminLayout.tsx للحماية
// - الـ middleware هنا مسؤول فقط عن التوجيه الأساسي
// ============================================================

import { NextRequest, NextResponse } from "next/server";

// المسارات العامة التي لا تحتاج أي توكن
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/pricing",
  "/FAQS",
  "/Login",
  "/Register",
  "/auth/verifyEmail",
  "/auth/ForgotPassword",
  "/auth/reset-password",
  "/auth/change-password",
];

// الملفات الثابتة والـ API — يتجاهلها الـ middleware كلياً
const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/_next/webpack",
  "/favicon.ico",
  "/api/",
  "/assets/",
  "/images/",
  "/icons/",
  "/lotties/",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function shouldSkip(pathname: string): boolean {
  return SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// ─── أسماء الـ cookies المحتملة في المشروع ────────────────────
// الـ README يذكر httpOnly Cookie للـ refresh token
// js-cookie يُخزّن الـ access token باسم قابل للقراءة
const ACCESS_TOKEN_COOKIE_NAMES = [
  "access_token",
  "accessToken",
  "token",
  "jwt",
  "Authorization",
];

function findToken(request: NextRequest): string | undefined {
  for (const name of ACCESS_TOKEN_COOKIE_NAMES) {
    const val = request.cookies.get(name)?.value;
    if (val) return val;
  }
  return undefined;
}

// فك تشفير بسيط للـ JWT بدون التحقق من الـ signature
function decodeJWT(token: string): { role?: string; exp?: number } | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    // دعم base64url و base64 عادي
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── تجاهل الملفات الثابتة ────────────────────────────────
  if (shouldSkip(pathname)) return NextResponse.next();

  // ─── المسارات العامة — مرور حر ────────────────────────────
  if (isPublicPath(pathname)) {
    // إذا كان مسجّل دخول وحاول فتح Login → وجّهه للـ Dashboard
    const token = findToken(request);
    if (token && (pathname === "/Login" || pathname === "/Register")) {
      const payload = decodeJWT(token);
      if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
        const role = payload.role;
        const dest =
          role === "admin" || role === "staff" ? "/Dashboard" : "/cars";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    }
    return NextResponse.next();
  }

  // ─── باقي المسارات: تحقق من وجود توكن ───────────────────
  // ملاحظة: الحماية العميقة (role check) يتولّاها AdminGuard.tsx
  // الـ middleware هنا يتحقق فقط من وجود التوكن أو الـ refresh cookie
  const token = findToken(request);

  // كذلك فحص الـ refresh token كدليل على تسجيل الدخول
  const refreshToken =
    request.cookies.get("refresh_token")?.value ||
    request.cookies.get("refreshToken")?.value;

  const isLoggedIn = !!(token || refreshToken);

  if (!isLoggedIn) {
    // لا يوجد أي توكن → صفحة Login
    const loginUrl = new URL("/Login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── إذا كان التوكن موجوداً تحقق من انتهاء صلاحيته ──────
  if (token) {
    const payload = decodeJWT(token);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      // التوكن منتهي — اترك الـ api-client يتولى الـ refresh
      // إذا فشل الـ refresh سيحوّل api-client للـ Login تلقائياً
      // لا نعيد التوجيه هنا لأن الـ refreshToken قد ينجح
      return NextResponse.next();
    }
  }

  // ─── السماح بالمرور — AdminGuard يتولى باقي التحقق ──────
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * طبّق على كل المسارات عدا:
     * - _next/static (ملفات ثابتة)
     * - _next/image (صور مُحسَّنة)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};