// ============================================================
// src/utils/Routes.ts  (يُضاف إلى src/utils/routes.tsx الموجود)
// مصدر واحد لكل مسارات التطبيق
// ============================================================

export const Routes = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // صفحات عامة (public) — route group: (public)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 1,  key: "Home",             path: "/"                       },
  { id: 2,  key: "About",            path: "/about"                  },
  { id: 3,  key: "Pricing",          path: "/pricing"                },
  { id: 4,  key: "FAQS",             path: "/FAQS"                   },
  { id: 5,  key: "Register",         path: "/Register"               },
  { id: 6,  key: "Login",            path: "/Login"                  },
  { id: 7,  key: "AddCars",          path: "/AddCars"                },
  { id: 8,  key: "Staff",            path: "/Staff"                  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // صفحات المصادقة (auth)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 10, key: "VerifyEmail",      path: "/auth/verifyEmail"       },
  { id: 11, key: "ForgotPassword",   path: "/auth/ForgotPassword"    },
  { id: 12, key: "ResetPassword",    path: "/auth/reset-password"    },
  { id: 13, key: "ChangePassword",   path: "/auth/change-password"   },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // صفحات الأدمن — route group: (admin)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 14, key: "Dashboard",        path: "/Dashboard"              },
  { id: 15, key: "AdminCars",        path: "/CarsPage"               },
  { id: 16, key: "AdminBookings",    path: "/BookingsPage"           },
  { id: 17, key: "AdminPayments",    path: "/PaymentsPage"           },
  { id: 18, key: "AdminReviews",     path: "/ReviewsPage"            },
  { id: 19, key: "AdminBrands",      path: "/BrandsPage"             },
  { id: 20, key: "AdminCategories",  path: "/CategoriesPage"         },
  { id: 21, key: "AdminLocations",   path: "/LocationsPage"          },
  { id: 22, key: "AdminCoupons",     path: "/CouponsPage"            },
  { id: 23, key: "AdminNotifications", path: "/NotificationsPage"    },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // صفحات المستخدم — route group: (user)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 24, key: "Cars",             path: "/cars"                   },
  { id: 25, key: "CarDetail",        path: "/cars/:slug"             },
  { id: 26, key: "NewBooking",       path: "/bookings/new"           },
  { id: 27, key: "MyBookings",       path: "/bookings/my"            },
  { id: 28, key: "BookingDetail",    path: "/bookings/:id"           },
  { id: 29, key: "Favorites",        path: "/favorites"              },
  { id: 30, key: "Profile",          path: "/profile"                },
  { id: 31, key: "UserNotifications", path: "/notifications"         },
  { id: 32, key: "Payments",         path: "/payments"               },
  { id: 33, key: "Loyalty",          path: "/loyalty"                },
] as const;

// ─── Types ───────────────────────────────────────────────────
export type RouteKey  = (typeof Routes)[number]["key"];
export type RoutePath = (typeof Routes)[number]["path"];

// ─── getPath: الحصول على المسار بالـ key ─────────────────────
export function getPath(key: RouteKey): string {
  const route = Routes.find((r) => r.key === key);
  if (!route) throw new Error(`Route key "${key}" غير موجود`);
  return route.path;
}

// ─── buildPath: مسار ديناميكي مع params ──────────────────────
// مثال: buildPath("CarDetail", { slug: "bmw-x5" }) → "/cars/bmw-x5"
export function buildPath(
  key: RouteKey,
  params: Record<string, string> = {}
): string {
  let path = getPath(key);
  Object.entries(params).forEach(([k, v]) => {
    path = path.replace(`:${k}`, encodeURIComponent(v));
  });
  return path;
}

// ─── تصنيف المسارات حسب الصلاحية ────────────────────────────
export const PublicPaths: string[] = [
  "/", "/about", "/pricing", "/FAQS",
  "/Login", "/Register", "/AddCars", "/Staff",
  "/auth/verifyEmail", "/auth/ForgotPassword",
  "/auth/reset-password", "/auth/change-password",
];

// مسارات تحتاج تسجيل دخول (أي role)
export const UserProtectedRoutes: string[] = [
  "/bookings", "/favorites",
  "/profile", "/notifications", "/payments", "/loyalty",
];

// مسارات تحتاج role = admin أو staff
export const AdminProtectedRoutes: string[] = [
  "/Dashboard", "/CarsPage", "/BookingsPage", "/PaymentsPage",
  "/ReviewsPage", "/BrandsPage", "/CategoriesPage",
  "/LocationsPage", "/CouponsPage", "/NotificationsPage",
];