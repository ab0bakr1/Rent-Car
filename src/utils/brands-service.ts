import apiClient from "@/lib/api-client";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  carsCount?: number;
  createdAt: string;
}

export interface BrandFormData {
  name: string;
  logo?: string | null;
}

// جلب كل الماركات
export async function getBrands(): Promise<Brand[]> {
  const response = await apiClient.get("/brands");
  return response.data.data ?? response.data;
}

function cleanPayload(payload: BrandFormData): Partial<BrandFormData> {
  return {
    name: payload.name,
    ...(payload.logo ? { logo: payload.logo } : {}),
  };
}

// إنشاء ماركة جديدة
export async function createBrand(payload: BrandFormData): Promise<Brand> {
  try {
    const response = await apiClient.post("/brands", payload);
    return response.data.data ?? response.data;
  } catch (err: any) {
    console.error("API Error details:", err.response?.data); // ← هذا يظهر السبب الحقيقي
    throw err;
  }
}

// تعديل ماركة
export async function updateBrand(id: string, payload: BrandFormData): Promise<Brand> {
  const response = await apiClient.patch(`/brands/${id}`, payload);
  return response.data.data ?? response.data;
}

// حذف ماركة
export async function deleteBrand(id: string): Promise<void> {
  await apiClient.delete(`/brands/${id}`);
}