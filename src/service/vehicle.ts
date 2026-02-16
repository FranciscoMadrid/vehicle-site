import type { Vehicle } from "@/layout/components/util/type";
import { apiRequest } from "./api";

export interface VehicleFilters {
  brand?: string;
  model?: string;
  plate?: string;
  startDate?: string;
  endDate?: string;
}

export const VehicleService = {
  getAll: (filters: VehicleFilters = {}) => {
    const query = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if(value !== undefined && value !== null && value !== ""){
        query.append(key, value)
      }
    })
    return apiRequest<Vehicle[]>(`/vehicle?${query.toString()}`);
  },
  getById: (id: string) => apiRequest<Vehicle>(`/vehicle/${id}`),

  create: (data: Vehicle) => apiRequest<Vehicle>('/vehicle', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Vehicle>) => apiRequest<{ message: string }>(`/vehicle/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest<{ message: string }>(`/vehicle/${id}`, {
    method: 'DELETE',
  }),
}