"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "../atoms/Title";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import { addCar } from "@/utils/cars-service";
import { apiClient } from "@/lib/api-client"; 
import { 
  CarFront, 
  Save, 
  ArrowRight, 
  Tag, 
  Images,
  UploadCloud
} from "lucide-react";
import Link from "next/link";

export default function AddCar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | string[] | null>(null);
  const [success, setSuccess] = useState(false);

  // 1. حالة حقول النص والخيارات
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    year: new Date().getFullYear().toString(),
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    depositAmount: "",
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    seats: "5",
    description: "",
    brandId: "",
    categoryId: "",
    locationId: "",
    color: "",
    plateNumber: "",
    hasAC: true,
    hasGPS: false,
    hasInsurance: false,
  });

  // 2. حالة مخصصة للاحتفاظ بملفات الصور الحقيقية المستوردة من الجهاز
  const [imageFiles, setImageFiles] = useState<{
    mainImage: File | null;
    subImage1: File | null;
    subImage2: File | null;
    subImage3: File | null;
  }>({
    mainImage: null,
    subImage1: null,
    subImage2: null,
    subImage3: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // دالة مخصصة لالتقاط الملفات الحقيقية عند اختيارها من الجهاز
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setImageFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // 1. تجهيز بيانات السيارة الأساسية النظيفة
        const carPayload = {
          name: formData.name,
          model: formData.model,
          year: parseInt(formData.year, 10),
          pricePerDay: Number(formData.pricePerDay),
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          seats: parseInt(formData.seats, 10),
          brandId: formData.brandId,
          categoryId: formData.categoryId,
          
          ...(formData.pricePerWeek && { pricePerWeek: Number(formData.pricePerWeek) }),
          ...(formData.pricePerMonth && { pricePerMonth: Number(formData.pricePerMonth) }),
          ...(formData.depositAmount && { depositAmount: Number(formData.depositAmount) }),
          ...(formData.locationId && { locationId: formData.locationId }),
          ...(formData.description && { description: formData.description }),
          ...(formData.color && { color: formData.color }),
          ...(formData.plateNumber && { plateNumber: formData.plateNumber }),
          
          hasAC: formData.hasAC,
          hasGPS: formData.hasGPS,
          hasInsurance: formData.hasInsurance,
        };

        // 2. إرسال طلب إنشاء السيارة
        const carResponse = await addCar(carPayload as any) as any;
        const newCarId = carResponse?.data?.data?.id || carResponse?.data?.id || carResponse?.id; 

        if (!newCarId) {
          throw new Error("لم يتمكن النظام من استرداد الرقم المعرف للسيارة الجديدة.");
        }

        // 3. رفع الصور الحقيقية بالتوافق المطلق مع طلبات الـ Controller
        
        // أ: رفع الملف الرئيسي (isMain = true كـ Query Parameter)
        if (imageFiles.mainImage) {
          try {
            const mainFormData = new FormData();
            // نستخدم الاسم "image" حصرياً كما يتوقعه الـ FileInterceptor
            mainFormData.append("image", imageFiles.mainImage); 

            // نقوم بتمرير isMain عبر الرابط (Query)ตาม الـ Specification للباك اند
            await apiClient.post(`/cars/${newCarId}/images?isMain=true`, mainFormData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log("✓ تم رفع الصورة الرئيسية بنجاح");
          } catch (imgErr) {
            console.error("فشل رفع الصورة الرئيسية:", imgErr);
          }
        }

        // ب: تجميع ورفع ملفات الصور الفرعية (isMain = false كـ Query Parameter)
        const subFilesArray = [imageFiles.subImage1, imageFiles.subImage2, imageFiles.subImage3].filter(
          (file) => file !== null
        );

        for (const subFile of subFilesArray) {
          if (subFile) {
            try {
              const subFormData = new FormData();
              subFormData.append("image", subFile); // نفس اسم الحقل المعتمد بالباك اند لكل صورة

              // نمرر ?isMain=false في نهاية رابط الـ Endpoint
              await apiClient.post(`/cars/${newCarId}/images?isMain=false`, subFormData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              console.log("✓ تم رفع صورة فرعية بنجاح");
            } catch (imgErr) {
              console.error("فشل رفع إحدى الصور الفرعية:", imgErr);
            }
          }
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/Dashboard");
        }, 2000);

      } catch (err: any) {
        const serverError = err?.response?.data?.errors || err?.response?.data?.message || err.message;
        setError(serverError || "حدث خطأ أثناء إضافة السيارة.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen ds-bg px-4 pt-32 pb-10 flex justify-center" dir="rtl">
      <div className="w-full max-w-3xl">
        <Link href="/Dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium">
          <ArrowRight size={20} />
          العودة للوحة التحكم
        </Link>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-md">
          <Title variant="primary" size="lg" className="mb-2">
            إضافة سيارة جديدة مع رفع ملفات الصور الحقيقية
          </Title>
          <Text variant="secondary" size="md" className="!pt-0 mb-8">
            قم بتعبئة مواصفات السيارة واختيار الصور مباشرة من جهازك المحمول أو الكمبيوتر.
          </Text>

          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl mb-6 font-medium">
              🎉 تمت إضافة السيارة بنجاح وحفظ ألبوم الصور المرفوعة بداخل قاعدة البيانات!
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 font-medium text-sm">
              {Array.isArray(error) ? (
                <ul className="list-disc list-inside">
                  {error.map((err, index) => <li key={index}>{err}</li>)}
                </ul>
              ) : <p>{error}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. البيانات الأساسية */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-md font-semibold text-blue-600 mb-4">1. البيانات الأساسية للسيارة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">اسم السيارة الكامل</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><CarFront size={18} /></div>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="تويوتا كامري 2024" className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">الموديل / الفئة</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Tag size={18} /></div>
                    <input type="text" name="model" required value={formData.model} onChange={handleChange} placeholder="Camry" className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">سنة الصنع</label>
                  <input type="number" name="year" required min="1990" max={new Date().getFullYear() + 1} value={formData.year} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">عدد المقاعد</label>
                  <input type="number" name="seats" required min="1" max="15" value={formData.seats} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" />
                </div>
              </div>
            </div>

            {/* 2. الروابط والعلاقات المعرفية */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-md font-semibold text-blue-600 mb-4">2. المعرفات التقنية (UUIDs)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">رقم الـ Brand ID</label>
                  <input type="text" name="brandId" required value={formData.brandId} onChange={handleChange} placeholder="كود UUID للماركة" className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-left" dir="ltr" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">رقم الـ Category ID</label>
                  <input type="text" name="categoryId" required value={formData.categoryId} onChange={handleChange} placeholder="كود UUID للفئة" className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-left" dir="ltr" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">نوع الناقل</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <option value="AUTOMATIC">AUTOMATIC</option>
                    <option value="MANUAL">MANUAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">نوع الوقود</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <option value="PETROL">PETROL</option>
                    <option value="DIESEL">DIESEL</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                    <option value="HYBRID">HYBRID</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 📸 3. رفع الملفات الحقيقية المتوافق مع مصفاة الباك اند وعملية الـ filename */}
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <h3 className="text-md font-semibold text-blue-600 mb-4 flex items-center gap-2">
                <Images size={20} />
                3. رفع صور السيارة من الجهاز (Image Upload)
              </h3>
              
              <div className="space-y-5">
                {/* حقل الصورة الرئيسية */}
                <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl">
                  <label className="block text-blue-700 dark:text-blue-400 font-semibold mb-2 text-sm flex items-center gap-2">
                    <UploadCloud size={16} />
                    اختر الصورة الرئيسية للسيارة (واجهة العرض للمستخدم) *
                  </label>
                  <input 
                    type="file" 
                    name="mainImage" 
                    required 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                  {imageFiles.mainImage && (
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ تم تجهيز: {imageFiles.mainImage.name}</p>
                  )}
                </div>

                {/* حقول الصور الفرعية للألبوم */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">ألبوم الصور الإضافية (يمكنك اختيار حتى 3 صور):</span>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1">الصورة الفرعية الأولى</label>
                      <input type="file" name="subImage1" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-white file:text-gray-700 cursor-pointer" />
                      {imageFiles.subImage1 && <p className="text-[11px] text-blue-500 mt-0.5">✓ {imageFiles.subImage1.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1">الصورة الفرعية الثانية</label>
                      <input type="file" name="subImage2" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-white file:text-gray-700 cursor-pointer" />
                      {imageFiles.subImage2 && <p className="text-[11px] text-blue-500 mt-0.5">✓ {imageFiles.subImage2.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-xs mb-1">الصورة الفرعية الثالثة</label>
                      <input type="file" name="subImage3" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-500 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-200 dark:file:bg-gray-700 dark:file:text-white file:text-gray-700 cursor-pointer" />
                      {imageFiles.subImage3 && <p className="text-[11px] text-blue-500 mt-0.5">✓ {imageFiles.subImage3.name}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. التسعير والملحقات */}
            <div>
              <h3 className="text-md font-semibold text-blue-600 mb-3">4. التسعير والملحقات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">السعر اليومي ($)</label>
                  <input type="number" name="pricePerDay" required min="0" value={formData.pricePerDay} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1 text-sm">مبلغ التأمين المسترد ($)</label>
                  <input type="number" name="depositAmount" min="0" value={formData.depositAmount} onChange={handleChange} placeholder="500" className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" name="hasAC" checked={formData.hasAC} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  تكييف (AC)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" name="hasGPS" checked={formData.hasGPS} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  خرائط (GPS)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input type="checkbox" name="hasInsurance" checked={formData.hasInsurance} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  تأمين شامل
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-6 flex items-center justify-center gap-2 py-3"
            >
              <Save size={20} />
              {loading ? "جاري إنشاء السيارة ورفع ملفات الصور..." : "حفظ السيارة ورفع الألبوم كاملاً"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}