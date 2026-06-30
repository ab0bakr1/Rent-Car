// ============================================================
// src/components/organisms/user/ProfilePage.tsx
// صفحة الملف الشخصي — /profile
// مميزات: شارة VIP، رفع صورة، رخصة القيادة، الأمان
// ============================================================
"use client";

import { useRef, useState, useEffect } from "react";
import { getPath } from "@/utils/routes";
import {
  Camera, Shield, Lock, Smartphone, Upload, CheckCircle2, AlertCircle
} from "lucide-react";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
  useUploadLicense,
} from "@/hooks/user/useUserQueries";
import { VipBadge, LoyaltyPoints, TierProgress } from "@/components/atoms/VipBadge";
import { ProfileSkeleton } from "@/components/atoms/skeletons";

export function ProfilePage() {
  const avatarRef  = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar  = useUploadAvatar();
  const uploadLicense = useUploadLicense();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [saved, setSaved]       = useState(false);

  // ✅ useEffect بدل if داخل render — يعمل مرة واحدة عند تحميل البيانات
  useEffect(() => {
    if (profile && !fullName) {
      setFullName(profile.fullName ?? "");
      setPhone(profile.phone ?? "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.fullName, profile?.phone]);

  async function handleSave() {
    await updateProfile.mutateAsync({ fullName, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  }

  function handleLicenseChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadLicense.mutate(file);
  }

  if (isLoading || !profile) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        الملف الشخصي
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── العمود الأيسر: البيانات الشخصية ─── */}
        <div className="space-y-5">
          {/* الصورة والاسم */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {(profile?.fullName ?? "م").charAt(0)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => avatarRef.current?.click()}
                  disabled={uploadAvatar.isPending}
                  className="absolute -bottom-1 -end-1 w-6 h-6 bg-blue-600 text-white rounded-full 
                             flex items-center justify-center shadow hover:bg-blue-700 transition-colors"
                  title="تغيير الصورة"
                >
                  {uploadAvatar.isPending ? (
                    <span className="text-xs animate-spin">⏳</span>
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* الاسم والتير */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white truncate">
                  {profile.fullName}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  عضو منذ {new Date(profile.createdAt).getFullYear()}
                </p>
                {/* ✨ شارة VIP */}
                <VipBadge tier={profile.loyaltyTier} size="sm" />
              </div>
            </div>

            {/* نقاط الولاء */}
            <div className="mb-5">
              <LoyaltyPoints points={profile.loyaltyPoints} tier={profile.loyaltyTier} />
            </div>

            {/* نموذج التعديل */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={fullName ?? ""}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full h-10 px-3 rounded-xl border border-gray-100 dark:border-gray-800 
                             bg-gray-50 dark:bg-gray-800 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  رقم الجوال
                </label>
                <input
                  type="tel"
                  value={phone ?? ""}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 text-sm text-end focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* زر الحفظ */}
            <button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="mt-4 w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 
                         text-white font-medium text-sm rounded-xl transition-colors"
            >
              {updateProfile.isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </button>
            {saved && (
              <div className="mt-2 flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm justify-center">
                <CheckCircle2 className="w-4 h-4" />
                تم الحفظ بنجاح
              </div>
            )}
          </div>
        </div>

        {/* ─── العمود الأيمن ─── */}
        <div className="space-y-5">
          {/* رخصة القيادة */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              🪪 رخصة القيادة
            </h2>

            {profile.licenseUrl ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    الرخصة مرفوعة
                  </p>
                  {profile.licenseExpiry && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                      تنتهي: {new Date(profile.licenseExpiry).toLocaleDateString("ar-SA")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => licenseRef.current?.click()}
                  className="text-xs text-green-600 underline"
                >
                  تحديث
                </button>
              </div>
            ) : (
              <button
                onClick={() => licenseRef.current?.click()}
                disabled={uploadLicense.isPending}
                className="w-full py-8 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 
                           flex flex-col items-center gap-2 text-gray-400 hover:border-blue-400 
                           hover:text-blue-500 transition-colors"
              >
                {uploadLicense.isPending ? (
                  <span className="text-2xl animate-spin">⏳</span>
                ) : (
                  <>
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">ارفع صورة رخصة القيادة</span>
                    <span className="text-xs">JPG أو PNG · حد أقصى 5MB</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={licenseRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleLicenseChange}
            />
          </div>

          {/* مستوى الولاء */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              👑 مستوى الولاء
            </h2>
            <TierProgress
              tier={profile.loyaltyTier}
              points={profile.loyaltyPoints}
              pointsToNextTier={500}
              nextTier={
                profile.loyaltyTier === "bronze" ? "silver" :
                profile.loyaltyTier === "silver" ? "gold" :
                profile.loyaltyTier === "gold"   ? "platinum" : null
              }
            />
            <button
              onClick={() => window.location.href = getPath("Loyalty")}
              className="mt-3 w-full h-9 rounded-xl border border-gray-200 dark:border-gray-700 
                         text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-colors"
            >
              عرض المكافآت والمزايا
            </button>
          </div>

          {/* الأمان */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              الأمان
            </h2>
            <div className="space-y-2">
              <button className="w-full h-10 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 
                                 px-3 text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-colors">
                <Lock className="w-4 h-4 text-gray-400" />
                تغيير كلمة المرور
              </button>
              <button className="w-full h-10 flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 
                                 px-3 text-sm text-gray-600 dark:text-gray-300 hover:border-blue-400 transition-colors">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  التحقق بخطوتين
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  profile.twoFactorEnabled
                    ? "bg-green-100 dark:bg-green-950/50 text-green-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}>
                  {profile.twoFactorEnabled ? "مفعّل" : "معطّل"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}