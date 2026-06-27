# 🚗 Rent-a-Car — Frontend

نظام متكامل لتأجير السيارات مبني باستخدام أحدث تقنيات تطوير الويب، يهدف إلى توفير تجربة مستخدم سلسة وسريعة بتصميم عصري وجذاب. تم بناء المشروع بالاعتماد على **Next.js 16** مع تطبيق مبادئ **Clean Architecture** و **Atomic Design** لضمان قابلية التوسع والصيانة.

---

## 📋 فهرس المحتويات

- [المميزات](#-مميزات-المشروع)
- [التقنيات المستخدمة](#️-التقنيات-المستخدمة)
- [هيكلية المشروع](#-هيكلية-المشروع)
- [صفحات التطبيق](#-صفحات-التطبيق)
- [المكونات](#-المكونات-components)
- [البدء في المشروع](#-البدء-في-المشروع)
- [أوامر التشغيل](#-أوامر-التشغيل)
- [إرشادات التطوير](#-إرشادات-التطوير)

---

## ✨ مميزات المشروع

### الواجهة العامة (Public)
- ⚡ **أداء فائق**: مبني باستخدام Next.js 16 App Router لتوفير أفضل أداء و SEO.
- 🎨 **تصميم عصري ومتجاوب**: تم استخدام Tailwind CSS v4 لبناء واجهات متجاوبة بالكامل.
- 🌓 **الوضع الليلي والنهاري (Dark/Light Mode)**: مدمج باستخدام `next-themes`.
- 🌍 **دعم اللغات (العربية والإنجليزية)**: متعدد اللغات مدعوم بواسطة `next-intl`.
- 🎬 **حركات وتفاعلات سلسة**: مدعوم بواسطة GSAP (Reveal, Floating) و رسومات Lottie.
- 🔐 **نظام مصادقة كامل**: تسجيل، دخول، تحقق إيميل، نسيان كلمة المرور، إعادة تعيين كلمة المرور، تغيير كلمة المرور.
- 🔄 **إدارة التوكنات تلقائياً**: JWT Auto-Refresh مع httpOnly Cookies و Token Rotation.

### لوحة تحكم الأدمن (Admin Dashboard)
- 📊 **لوحة معلومات شاملة**: إحصائيات ورسوم بيانية تفاعلية باستخدام Recharts.
- 🚗 **إدارة السيارات**: إضافة، تعديل، حذف، رفع صور، إدارة مواصفات كاملة.
- 📅 **إدارة الحجوزات**: عرض، تغيير الحالة، تتبع كل الحجوزات.
- 💳 **إدارة المدفوعات**: عرض المدفوعات، معالجة المبالغ المستردة (Refunds).
- ⭐ **إدارة التقييمات**: مراجعة، قبول، رفض، والرد على التقييمات.
- 🏷️ **إدارة العلامات التجارية**: CRUD كامل للبراندات.
- 🗂️ **إدارة التصنيفات**: CRUD كامل للتصنيفات.
- 📍 **إدارة المواقع**: إدارة مواقع الاستلام والتسليم.
- 🎫 **إدارة الكوبونات**: إنشاء وإدارة أكواد الخصم.
- 🔔 **إدارة الإشعارات**: إرسال إشعارات للمستخدمين.
- 👥 **إدارة الموظفين**: إدارة حسابات الأدمن والموظفين.

---

## 🛠️ التقنيات المستخدمة

### **الأساسيات (Core)**

| التقنية | الإصدار | الوصف |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.6 | إطار عمل React مع App Router |
| [React](https://react.dev/) | 19.2.3 | مكتبة بناء واجهات المستخدم |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | كتابة كود قوي وخالي من الأخطاء |

### **التصميم والتنسيق (Styling & UI)**

| التقنية | الوصف |
|---|---|
| [Tailwind CSS v4](https://tailwindcss.com/) | إطار عمل CSS المرافق |
| `clsx` + `tailwind-merge` | دمج فئات Tailwind بسهولة وبشكل ديناميكي |
| Geist Font | خط Google Fonts مدمج مع Next.js |

### **البيانات والحالة (Data Fetching & State)**

| التقنية | الوصف |
|---|---|
| [React Query v5](https://tanstack.com/query/latest) | إدارة استدعاء البيانات والتخزين المؤقت |
| [Axios](https://axios-http.com/) | HTTP Client مع JWT Interceptors |
| [js-cookie](https://github.com/js-cookie/js-cookie) | إدارة الكوكيز |
| [jwt-decode](https://github.com/auth0/jwt-decode) | فك تشفير التوكنات |

### **التدويل (Internationalization)**

| التقنية | الوصف |
|---|---|
| [next-intl](https://next-intl-docs.vercel.app/) | ترجمة الموقع (عربي / إنجليزي) |

### **الرسوم البيانية (Charts)**

| التقنية | الوصف |
|---|---|
| [Recharts](https://recharts.org/) | رسوم بيانية تفاعلية للوحة تحكم الأدمن |

### **الحركة والرسوميات (Animations & Icons)**

| التقنية | الوصف |
|---|---|
| [GSAP](https://gsap.com/) | حركات معقدة وسلسة (Reveal, Floating) |
| [Lottie React](https://lottiefiles.com/) | رسومات Lottie التفاعلية (Loading, No-Data, Not-Found) |
| `lucide-react` | مكتبة أيقونات |
| `react-icons` | مكتبة أيقونات متعددة |
| `@iconify/react` | مكتبة أيقونات شاملة |

---

## 📂 هيكلية المشروع

```text
src/
├── animations/              # حركات GSAP المخصصة
│   ├── Reveal.tsx           # تأثير ظهور العناصر عند التمرير
│   └── floating.tsx         # تأثير الطفو المتحرك
│
├── app/                     # مسارات Next.js (App Router)
│   ├── (public)/            # الصفحات العامة
│   │   ├── about/           # صفحة من نحن
│   │   ├── pricing/         # صفحة الأسعار
│   │   ├── faqs/            # صفحة الأسئلة الشائعة
│   │   ├── Login/           # صفحة تسجيل الدخول
│   │   ├── Register/        # صفحة إنشاء حساب
│   │   ├── AddCars/         # صفحة إضافة سيارة
│   │   ├── Staff/           # صفحة إدارة الموظفين
│   │   └── auth/            # صفحات المصادقة الفرعية
│   │       ├── verifyEmail/
│   │       ├── ForgotPassword/
│   │       ├── reset-password/
│   │       └── change-password/
│   │
│   ├── (admin)/             # صفحات لوحة تحكم الأدمن
│   │   ├── Dashboard/       # لوحة المعلومات الرئيسية
│   │   ├── CarsPage/        # إدارة السيارات
│   │   ├── BookingsPage/    # إدارة الحجوزات
│   │   ├── PaymentsPage/    # إدارة المدفوعات
│   │   ├── ReviewsPage/     # إدارة التقييمات
│   │   ├── BrandsPage/      # إدارة العلامات التجارية
│   │   ├── CategoriesPage/  # إدارة التصنيفات
│   │   ├── LocationsPage/   # إدارة المواقع
│   │   ├── CouponsPage/     # إدارة الكوبونات
│   │   └── NotificationsPage/ # إدارة الإشعارات
│   │
│   ├── globals.css          # التنسيقات العامة
│   ├── layout.tsx           # التخطيط الرئيسي
│   ├── page.tsx             # الصفحة الرئيسية
│   ├── loading.tsx          # صفحة التحميل
│   └── not-found.tsx        # صفحة 404
│
├── components/              # مكونات واجهة المستخدم (Atomic Design)
│   ├── atoms/               # المكونات الأساسية الصغرى
│   │   ├── Button.tsx
│   │   ├── Text.tsx
│   │   ├── Title.tsx
│   │   ├── Icon.tsx
│   │   ├── Images.tsx
│   │   ├── Select.tsx
│   │   ├── ThemeButton.tsx
│   │   ├── LocalSwitcher.tsx
│   │   └── navbar/          # عناصر شريط التنقل
│   │       ├── NavLink.tsx
│   │       ├── NavLogo.tsx
│   │       └── NavIconButton.tsx
│   │
│   ├── molecules/           # مكونات مركبة
│   │   ├── Box.tsx
│   │   ├── Card.tsx
│   │   ├── From.tsx         # مكون النموذج
│   │   ├── Pagination.tsx
│   │   ├── Review.tsx
│   │   ├── Statusbadge.tsx
│   │   ├── Confirmdialog.tsx
│   │   ├── Emptystate.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── navbar/          # أجزاء شريط التنقل
│   │       ├── DesktopNavLinks.tsx
│   │       ├── MobileNavHeader.tsx
│   │       └── MobileNavLinks.tsx
│   │
│   ├── organisms/           # أجزاء كبيرة من الصفحة
│   │   ├── Hero.tsx         # القسم الرئيسي
│   │   ├── Navbar.tsx       # شريط التنقل
│   │   ├── Footer.tsx       # التذييل
│   │   ├── Contact.tsx      # نموذج التواصل
│   │   ├── Special.tsx      # قسم العروض
│   │   ├── WhyUs.tsx        # لماذا نحن
│   │   ├── Reviews.tsx      # قسم التقييمات
│   │   ├── CarGrid.tsx      # شبكة عرض السيارات
│   │   ├── AddCar.tsx       # نموذج إضافة سيارة
│   │   ├── Login.tsx        # نموذج تسجيل الدخول
│   │   ├── Register.tsx     # نموذج التسجيل
│   │   │
│   │   ├── auth/            # نماذج المصادقة
│   │   │   ├── Verifyemailform.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── Resetpasswordform.tsx
│   │   │   └── Changepasswordform.tsx
│   │   │
│   │   └── admin/           # مكونات لوحة تحكم الأدمن
│   │       ├── Dashboard.tsx
│   │       ├── DashboardCharts.tsx
│   │       ├── Cars.tsx
│   │       ├── Bookings.tsx
│   │       ├── Refund.tsx
│   │       ├── Brand.tsx
│   │       ├── Category.tsx
│   │       ├── Location.tsx
│   │       ├── Coupon.tsx
│   │       ├── ReviewReply.tsx
│   │       ├── SendNotification.tsx
│   │       ├── Staff.tsx
│   │       └── Modal/       # نوافذ الأدمن المنبثقة
│   │           ├── CarModal.tsx
│   │           ├── BrandModal.tsx
│   │           ├── CategoryModal.tsx
│   │           ├── LocationModal.tsx
│   │           ├── CouponModal.tsx
│   │           ├── RefundModal.tsx
│   │           ├── ReviewReplyModal.tsx
│   │           ├── SendNotificationModal.tsx
│   │           └── StaffModal.tsx
│   │
│   └── layout/              # مكونات التخطيط
│       ├── PublicLayout.tsx
│       ├── AdminLayout.tsx
│       └── AdminGuard.tsx   # حارس صلاحيات الأدمن
│
├── hooks/                   # React Hooks مخصصة
│   ├── useStaff.ts          # هوك إدارة الموظفين
│   └── auth/                # هوكس المصادقة
│       ├── useChangePassword.ts
│       ├── useForgotPassword.ts
│       ├── useResetPassword.ts
│       └── useVerifyEmail.ts
│
├── i18n/                    # إعدادات تعدد اللغات
│   ├── locale.ts            # إعدادات اللغة
│   └── request.ts           # معالجة طلبات الترجمة
│
├── lib/                     # الأدوات والمكتبات الأساسية
│   ├── api-client.ts        # Axios Client مع JWT Auto-Refresh
│   ├── auth.ts              # أدوات المصادقة المساعدة
│   └── cn.tsx               # دالة دمج فئات Tailwind
│
├── messages/                # ملفات الترجمة
│   ├── ar.json              # اللغة العربية
│   └── en.json              # اللغة الإنجليزية
│
├── providers/               # مزودي الحالة (Providers)
│   ├── AppProviders.tsx     # المزود الرئيسي (يجمع كل المزودات)
│   ├── ReactQueryProvider.tsx
│   └── ThemeProvider.tsx
│
├── styles/                  # متغيرات التصميم
│   └── variables.css        # CSS Custom Properties (Design Tokens)
│
├── types/                   # تعريفات TypeScript
│   └── global.d.ts          # أنواع عامة
│
└── utils/                   # خدمات API والبيانات
    ├── routes.tsx           # تعريف المسارات (21 مسار)
    ├── data.tsx             # بيانات ثابتة
    ├── cars-service.ts      # خدمة السيارات
    ├── bookings-service.ts  # خدمة الحجوزات
    ├── payments-service.ts  # خدمة المدفوعات
    ├── reviews-service.ts   # خدمة التقييمات
    ├── brands-service.ts    # خدمة العلامات التجارية
    ├── categories-service.ts # خدمة التصنيفات
    ├── locations-service.ts # خدمة المواقع
    ├── coupons-service.ts   # خدمة الكوبونات
    ├── notifications-service.ts # خدمة الإشعارات
    └── dashboard-charts-service.ts # خدمة بيانات الرسوم البيانية
```

---

## 📄 صفحات التطبيق

### الصفحات العامة (Public)

| المسار | الصفحة | الوصف |
|---|---|---|
| `/` | الرئيسية | Hero, عروض خاصة, لماذا نحن, تقييمات, تواصل |
| `/about` | من نحن | معلومات عن الشركة |
| `/pricing` | الأسعار | خطط وأسعار التأجير |
| `/FAQS` | الأسئلة الشائعة | الأسئلة المتكررة |
| `/Login` | تسجيل الدخول | نموذج الدخول |
| `/Register` | إنشاء حساب | نموذج التسجيل |
| `/AddCars` | إضافة سيارة | نموذج إضافة سيارة جديدة |
| `/Staff` | إدارة الموظفين | إدارة حسابات الأدمن |

### صفحات المصادقة (Auth)

| المسار | الوصف |
|---|---|
| `/auth/verifyEmail` | التحقق من البريد الإلكتروني |
| `/auth/ForgotPassword` | نسيان كلمة المرور |
| `/auth/reset-password` | إعادة تعيين كلمة المرور |
| `/auth/change-password` | تغيير كلمة المرور |

### لوحة تحكم الأدمن (Admin)

| المسار | الصفحة | الوصف |
|---|---|---|
| `/Dashboard` | لوحة المعلومات | إحصائيات شاملة ورسوم بيانية |
| `/CarsPage` | السيارات | إدارة كاملة للسيارات |
| `/BookingsPage` | الحجوزات | إدارة كل الحجوزات |
| `/PaymentsPage` | المدفوعات | إدارة المدفوعات والاسترداد |
| `/ReviewsPage` | التقييمات | مراجعة والرد على التقييمات |
| `/BrandsPage` | العلامات التجارية | إدارة البراندات |
| `/CategoriesPage` | التصنيفات | إدارة التصنيفات |
| `/LocationsPage` | المواقع | إدارة مواقع الاستلام/التسليم |
| `/CouponsPage` | الكوبونات | إدارة أكواد الخصم |
| `/NotificationsPage` | الإشعارات | إرسال إشعارات للمستخدمين |

---

## 🧩 المكونات (Components)

### نمط التصميم الذري (Atomic Design)

```
Atoms → أصغر وحدة بناء (Button, Text, Icon)
  ↓
Molecules → تجميع Atoms (Card, Pagination, AdminSidebar)
  ↓
Organisms → أقسام كاملة (Hero, Navbar, Dashboard, Admin CRUD)
  ↓
Layouts → هيكل الصفحة (PublicLayout, AdminLayout, AdminGuard)
```

### مكونات الأدمن — الموديلات (Modal)

كل صفحة إدارة تحتوي على مكون رئيسي + Modal:

| المكون | الموديل | الوظيفة |
|---|---|---|
| `Cars.tsx` | `CarModal.tsx` | إدارة السيارات مع نموذج شامل |
| `Brand.tsx` | `BrandModal.tsx` | إدارة العلامات التجارية |
| `Category.tsx` | `CategoryModal.tsx` | إدارة التصنيفات |
| `Location.tsx` | `LocationModal.tsx` | إدارة المواقع |
| `Coupon.tsx` | `CouponModal.tsx` | إدارة الكوبونات |
| `Refund.tsx` | `RefundModal.tsx` | معالجة المبالغ المستردة |
| `ReviewReply.tsx` | `ReviewReplyModal.tsx` | الرد على التقييمات |
| `SendNotification.tsx` | `SendNotificationModal.tsx` | إرسال الإشعارات |
| `Staff.tsx` | `StaffModal.tsx` | إدارة الموظفين |

---

## 🔐 نظام المصادقة (Authentication)

### آلية عمل التوكنات

```
Login/Register → يحصل على accessToken + refreshToken (httpOnly Cookie)
                     ↓
Request Interceptor → يفحص انتهاء الـ accessToken
                     ↓
إذا انتهى → يعمل refresh تلقائي عبر httpOnly Cookie
                     ↓
Response Interceptor → إذا 401 → يعيد المحاولة بـ token جديد
                     ↓
إذا فشل الـ Refresh → يحذف التوكن ويحول لصفحة Login
```

### المميزات:
- ✅ **Token Rotation**: كل refresh يولد tokens جديدة
- ✅ **httpOnly Cookies**: الـ Refresh Token محمي من XSS
- ✅ **Queue System**: طلبات متزامنة تنتظر الـ refresh الواحد
- ✅ **Auto-Refresh**: يبدأ التجديد قبل 60 ثانية من الانتهاء

---

## 🚀 البدء في المشروع

### المتطلبات الأساسية
- [Node.js](https://nodejs.org/) (الإصدار 20 أو أحدث)
- `npm` أو `yarn` أو `pnpm`
- Backend API شغال على `http://localhost:3001`

### خطوات التثبيت

1. **استنساخ المستودع**:
   ```bash
   git clone <repository-url>
   cd RentCar/rent-front
   ```

2. **تثبيت الحزم**:
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة**:
   ```bash
   # أنشئ ملف .env في مجلد rent-front
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env
   ```

4. **تشغيل بيئة التطوير**:
   ```bash
   npm run dev
   ```

5. **افتح المتصفح** على [http://localhost:3000](http://localhost:3000)

---

## 📜 أوامر التشغيل

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل خادم التطوير (Development Server) |
| `npm run build` | بناء المشروع لبيئة الإنتاج (Production Build) |
| `npm run start` | تشغيل خادم الإنتاج بعد البناء |
| `npm run lint` | فحص الكود بـ ESLint |

---

## 🧩 إرشادات التطوير

### 1. إضافة مكون جديد (Components)
- ضع المكون في المجلد المناسب تحت `src/components/` بناءً على حجمه (atom, molecule, organism).
- حافظ على كل مكون في ملف مستقل ويفضل أن يكون مرفقاً بـ TypeScript Interface الخاص به.

### 2. إضافة صفحة أدمن جديدة
```
1. أنشئ مجلد الصفحة في src/app/(admin)/NewPage/page.tsx
2. أنشئ مكون الصفحة في src/components/organisms/admin/NewPage.tsx
3. أنشئ الـ Modal في src/components/organisms/admin/Modal/NewPageModal.tsx
4. أنشئ الـ Service في src/utils/newpage-service.ts
5. أضف المسار في src/utils/routes.tsx
6. أضف الرابط في AdminSidebar.tsx
```

### 3. التنسيق (Styling)
- استخدم Tailwind CSS للستايلات.
- عند الحاجة لدمج فئات Tailwind مع فئات أخرى بشكل شرطي، استخدم دالة `cn` الموجودة في `src/lib/cn.tsx`.
- المتغيرات العامة للتصميم في `src/styles/variables.css`.

### 4. الترجمة (i18n)
- لإضافة نصوص جديدة، قم بإضافتها إلى ملفات الـ JSON في مجلد `src/messages/` (ar.json و en.json).
- استخدم `useTranslations` من `next-intl` لطباعة النصوص المترجمة.

### 5. جلب البيانات (Data Fetching)
- أنشئ ملف service في `src/utils/` يستخدم `apiClient` من `src/lib/api-client.ts`.
- استخدم React Query (`useQuery`, `useMutation`) في المكونات للحصول على التخزين المؤقت والتعامل مع الأخطاء.

### 6. الأصول الثابتة (Assets)
```
public/assets/
├── images/     # صور (Hero backgrounds, about, etc.)
├── icons/      # أيقونات مخصصة
└── lotties/    # ملفات Lottie (Loading, No-Data, Not-Found)
```

---

## 🔗 الربط مع الـ Backend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

الـ `apiClient` يدعم:
- ✅ Bearer Token تلقائي
- ✅ Auto-Refresh قبل انتهاء التوكن
- ✅ httpOnly Cookie للـ Refresh Token
- ✅ إعادة المحاولة التلقائية عند 401
- ✅ التحويل لصفحة Login عند فشل المصادقة

---

## 📞 الدعم والتواصل

إذا كان لديك أي أسئلة أو اقتراحات لتطوير النظام، يمكنك التواصل معي أو فتح Issue في المستودع.
