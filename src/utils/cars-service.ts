import { apiClient } from '@/lib/api-client';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type CarStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'INACTIVE';
export type Transmission = 'AUTOMATIC' | 'MANUAL';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';

export interface CarBrand {
  id: string;
  name: string;
}

export interface CarCategory {
  id: string;
  name: string;
}

export interface Car {
  id: string;
  name: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  status: CarStatus;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  brand?: CarBrand;
  brandId: string;
  category?: CarCategory;
  categoryId: string;
  rating?: number;
  isFeatured?: boolean;
}

export interface CarFormData {
  name: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  status: CarStatus;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  brandId: string;
  categoryId: string;
  isFeatured?: boolean;
}

export interface DashboardStats {
  cars: {
    total: number;
    available: number;
    booked: number;
  };
  users: {
    total: number;
    newThisMonth: number;
  };
  bookings: {
    total: number;
    thisMonth: number;
    pending: number;
    active: number;
    completed: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  pendingReviews: number;
  totalLocations: number;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  phone?: string;
}

/** Build a display name from first + last name */
export const staffFullName = (s: Staff): string =>
  [s.firstName, s.lastName].filter(Boolean).join(' ') || '—';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ─── Cars ─────────────────────────────────────────────────────────────────────

export const fetchCars = async (): Promise<Car[]> => {
  const response = await apiClient.get<ApiResponse<Car[]>>('/cars');
  return response.data.data;
};

export const fetchCarById = async (id: string): Promise<Car> => {
  const response = await apiClient.get<ApiResponse<Car>>(`/cars/${id}`);
  return response.data.data;
};

export const updateCar = async (id: string, carData: Partial<CarFormData>): Promise<Car> => {
  const payload = {
    name: carData.name,
    model: carData.model,
    year: Number(carData.year),
    pricePerDay: Number(carData.pricePerDay),
    seats: Number(carData.seats),
    status: carData.status,
    transmission: carData.transmission,
    fuelType: carData.fuelType,
    featuredImage: carData.image,  // ← image → featuredImage
    brandId: carData.brandId,
    categoryId: carData.categoryId,
    isFeatured: carData.isFeatured,
  };

  const response = await apiClient.patch<ApiResponse<Car>>(`/cars/${id}`, payload);
  return response.data.data;
};

export const addCar = async (carData: Omit<Car, 'id'>): Promise<Car> => {
  const payload = {
    ...carData,
    pricePerDay: Number(carData.pricePerDay),
    year: Number(carData.year),
    seats: Number(carData.seats),
  };
  const response = await apiClient.post<ApiResponse<Car>>('/cars', payload);
  return response.data.data;
};

export const deleteCar = async (id: string): Promise<void> => {
  await apiClient.delete(`/cars/${id}`);
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard');
  return response.data.data;
};

// ─── Staff ────────────────────────────────────────────────────────────────────

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const response = await apiClient.get<ApiResponse<Staff[]>>('/users');
    return response.data.data;
  },

  create: async (body: StaffFormData): Promise<Staff> => {
    const response = await apiClient.post<ApiResponse<Staff>>('/users', body);
    return response.data.data;
  },

  update: async (id: string, body: Partial<StaffFormData>): Promise<Staff> => {
    const payload: Partial<StaffFormData> = {};
    if (body.firstName !== undefined) payload.firstName = body.firstName;
    if (body.lastName  !== undefined) payload.lastName  = body.lastName;
    if (body.phone     !== undefined) payload.phone     = body.phone;

    const response = await apiClient.patch<ApiResponse<Staff>>(`/users/${id}`, payload);
    return response.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};