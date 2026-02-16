import type { Model } from "@/layout/components/util/type";
import { apiRequest } from "./api";

export const ModelService = {
  getAll: () => {
    return apiRequest<Model[]>(`/model`);
  },
  getById: (id: string) => apiRequest<Model>(`/model/${id}`),

  create: (data: Model) => apiRequest<Model>('/model', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: Partial<Model>) => apiRequest<{ message: string }>(`/model/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest<{ message: string }>(`/model/${id}`, {
    method: 'DELETE',
  }),
}