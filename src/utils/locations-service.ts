import apiClient from "@/lib/api-client";

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface LocationFormData {
  name: string;
  address: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
}

export async function getLocations(): Promise<Location[]> {
  const response = await apiClient.get("/locations");
  return response.data.data ?? response.data;
}

export async function createLocation(payload: LocationFormData): Promise<Location> {
  const { isActive, ...rest } = payload;
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const response = await apiClient.post("/locations", clean);
  return response.data.data ?? response.data;
}

export async function updateLocation(id: string, payload: LocationFormData): Promise<Location> {
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const response = await apiClient.patch(`/locations/${id}`, clean);
  return response.data.data ?? response.data;
}

export async function deleteLocation(id: string): Promise<void> {
  await apiClient.delete(`/locations/${id}`);
}