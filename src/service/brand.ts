import type { Brand } from "@/layout/components/util/type";
import { apiRequest } from "./api";

export const BrandService = {
  getAll: () => {
    return apiRequest<Brand[]>(`/brand`);
  },
  getById: (id: string) => apiRequest<Brand>(`/brand/${id}`),

  create: (data: Brand) => apiRequest<Brand>('/brand', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Brand>) => apiRequest<{ message: string }>(`/brand/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest<{ message: string }>(`/brand/${id}`, {
    method: 'DELETE',
  }),
}