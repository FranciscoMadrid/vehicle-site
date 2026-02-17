import type { Log } from "@/layout/components/util/type";
import { apiRequest } from "./api";

export interface LogFilters {
  id: string,
  brand: string,
  model: string,
  plate: string,
  driver_name: string,
  type: 'ENTRY' | 'EXIT',
  minMileage: string,
  maxMileage: string,
  startDate: string,
  endDate: string
}

export const LogService = {
  getAll: (filters: Partial<LogFilters> = {}) => {
    const query = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if(value !== undefined && value !== null && value !== ""){
        query.append(key, value)
      }
    })
    return apiRequest<Log[]>(`/log?${query.toString()}`);
  },
  getById: (id: string) => apiRequest<Log>(`/log/${id}`),

  create: (data: Log) => apiRequest<Log>('/log', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Log>) => apiRequest<{ message: string }>(`/log/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest<{ message: string }>(`/log/${id}`, {
    method: 'DELETE',
  }),
}