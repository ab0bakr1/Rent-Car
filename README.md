# 🚗 Rent-a-Car - نظام تأجير السيارات

نظام متكامل لتأجير السيارات مبني باستخدام أحدث تقنيات تطوير الويب، يهدف إلى توفير تجربة مستخدم سلسة وسريعة بتصميم عصري وجذاب. تم بناء المشروع بالاعتماد على **Next.js 16** مع تطبيق مبادئ **Clean Architecture** و **Atomic Design** لضمان قابلية التوسع والصيانة.

---

## ✨ مميزات المشروع (Features)

- ⚡ **أداء فائق**: مبني باستخدام Next.js App Router لتوفير أفضل أداء و SEO.
- 🎨 **تصميم عصري ومتجاوب**: تم استخدام Tailwind CSS v4 لبناء واجهات متجاوبة بالكامل.
- 🌓 **الوضع الليلي والنهاري (Dark/Light Mode)**: مدمج باستخدام `next-themes`.
- 🌍 **دعم اللغات (i18n)**: متعدد اللغات مدعوم بواسطة `next-intl`.
- 🔄 **إدارة حالة متقدمة لجلب البيانات**: باستخدام React Query (`@tanstack/react-query`) مع `axios`.
- 🎬 **حركات وتفاعلات سلسة (Animations)**: مدعوم بواسطة GSAP و رسومات Lottie.
- 🧩 **هيكلية منظمة**: تطبيق نمط التصميم الذري (Atomic Design) لتقسيم المكونات بشكل منطقي.
- 📱 **واجهة مستخدم احترافية**: تحتوي على أيقونات من `lucide-react` و `react-icons`.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

### **الأساسيات (Core)**
- [Next.js (v16.1.6)](https://nextjs.org/) - إطار عمل React.
- [React (v19)](https://react.dev/) - مكتبة بناء واجهات المستخدم.
- [TypeScript](https://www.typescriptlang.org/) - لكتابة كود قوي وخالي من الأخطاء.

### **التصميم والتنسيق (Styling & UI)**
- [Tailwind CSS v4](https://tailwindcss.com/) - إطار عمل CSS للمرافق.
- `clsx` & `tailwind-merge` - لدمج فئات Tailwind بسهولة وبشكل ديناميكي.

### **البيانات والحالة (Data Fetching & State)**
- [React Query (v5)](https://tanstack.com/query/latest) - لإدارة استدعاء البيانات (Data Fetching & Caching).
- [Axios](https://axios-http.com/) - لعمل الطلبات البرمجية (HTTP Requests).

### **التدويل (Internationalization)**
- [next-intl](https://next-intl-docs.vercel.app/) - لترجمة الموقع وتوفير اللغات المختلفة.

### **الحركة والرسوميات (Animations & Icons)**
- [GSAP](https://gsap.com/) - لإنشاء حركات معقدة وسلسة.
- [Lottie React](https://lottiefiles.com/) - لتشغيل رسومات Lottie التفاعلية.
- `lucide-react` / `react-icons` / `@iconify/react` - مكتبات الأيقونات.

---

## 📂 هيكلية المشروع (Project Structure)

تم تنظيم المشروع باتباع منهجية **التصميم الذري (Atomic Design)**:

```text
src/
├── animations/         # ملفات وحركات GSAP المخصصة (مثل Reveal, Floating)
├── app/                # مسارات Next.js (App Router)
│   ├── (public)/       # الصفحات العامة (about, faqs, pricing)
│   ├── globals.css     # التنسيقات العامة
│   └── layout.tsx / page.tsx
├── components/         # مكونات واجهة المستخدم (Atomic Design)
│   ├── atoms/          # المكونات الأساسية الصغرى (أزرار، نصوص، حقول إدخال)
│   ├── molecules/      # مكونات مركبة من الـ Atoms (بطاقات، قوائم)
│   ├── organisms/      # أجزاء كبيرة من الصفحة (Hero, Navbar, Footer, Contact)
│   └── layout/         # مكونات التخطيط الأساسية
├── i18n/               # إعدادات تعدد اللغات (next-intl)
├── lib/                # الوظائف المساعدة والمكتبات (مثل `cn.ts` لدمج الـ Tailwind)
├── messages/           # ملفات الترجمة (JSON) للغات المختلفة
├── providers/          # مزودي الحالة (Providers) لـ React Query و Theme وغيرها
├── styles/             # متغيرات التصميم (Design System Variables)
├── types/              # تعريفات TypeScript العامة (Interfaces & Types)
└── utils/              # وظائف المساعدة العامة والبيانات الثابتة (Constants, Data)
```

---

## 🚀 البدء في المشروع (Getting Started)

### المتطلبات الأساسية (Prerequisites)
- [Node.js](https://nodejs.org/) (الإصدار 20 أو أحدث موصى به).
- `npm` أو `yarn` أو `pnpm` أو `bun`.

### خطوات التثبيت (Installation)

1. **استنساخ المستودع (Clone the repository)**:
   ```bash
   git clone <repository-url>
   cd rent-Car
   ```

2. **تثبيت الحزم (Install dependencies)**:
   ```bash
   npm install
   ```

3. **تشغيل بيئة التطوير (Run development server)**:
   ```bash
   npm run dev
   ```

4. **افتح المتصفح** على الرابط [http://localhost:3000](http://localhost:3000) لمعاينة المشروع.

---

## 📜 أوامر التشغيل (Scripts)

| الأمر (Command) | الوظيفة (Description) |
| --- | --- |
| `npm run dev` | تشغيل خادم التطوير (Development Server). |
| `npm run build` | بناء المشروع لبيئة الإنتاج (Production Build). |
| `npm run start` | تشغيل خادم الإنتاج بعد البناء (Start Production Server). |
| `npm run lint` | فحص الكود والتأكد من خلوه من أخطاء التنسيق (ESLint). |

---

## 🧩 إرشادات التطوير (Development Guidelines)

1. **إضافة مكون جديد (Components)**: 
   - ضع المكون في المجلد المناسب تحت `src/components/` بناءً على حجمه (atom, molecule, organism).
   - حافظ على كل مكون في ملف مستقل ويفضل أن يكون مرفقاً بـ TypeScript Interfaces الخاص به.

2. **التنسيق (Styling)**:
   - استخدم Tailwind CSS للستايلات.
   - عند الحاجة لدمج فئات Tailwind مع فئات أخرى بشكل شرطي، استخدم دالة `cn` الموجودة في `src/lib/cn.ts`.

3. **الترجمة (i18n)**:
   - لإضافة نصوص جديدة، قم بإضافتها إلى ملفات الـ JSON في مجلد `src/messages/` لكل اللغات المدعومة.
   - استخدم `useTranslations` من `next-intl` لطباعة النصوص المترجمة في المكونات.

4. **جلب البيانات (Data Fetching)**:
   - استخدم React Query (`useQuery`, `useMutation`) للتعامل مع أي بيانات خارجية عن طريق الـ API للحصول على ميزة التخزين المؤقت (Caching) والتعامل مع الأخطاء بسهولة.

---

## 📞 الدعم والتواصل (Contact)

إذا كان لديك أي أسئلة أو اقتراحات لتطوير النظام، يمكنك التواصل معي أو فتح Issue في المستودع.
