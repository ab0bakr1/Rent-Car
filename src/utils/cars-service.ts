import { apiClient } from '@/lib/api-client';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
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

export const addCar = async (carData: Omit<Car, 'id'>): Promise<Car> => {
  const response = await apiClient.post<ApiResponse<Car>>('/cars', carData);
  return response.data.data;
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