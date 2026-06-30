import apiClient from "@/lib/api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  carsCount?: number;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  icon?: string | null;
}

// جلب كل الفئات
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get("/categories");
  return response.data.data ?? response.data;
}

// إنشاء فئة جديدة
export async function createCategory(payload: CategoryFormData): Promise<Category> {
  const response = await apiClient.post("/categories", payload);
  return response.data.data ?? response.data;
}

// تعديل فئة
export async function updateCategory(id: string, payload: CategoryFormData): Promise<Category> {
  const response = await apiClient.patch(`/categories/${id}`, payload);
  return response.data.data ?? response.data;
}

// حذف فئة
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}