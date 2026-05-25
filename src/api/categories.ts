import client from './client';
import type { ApiResponse, CategoryDto } from '@/types';

export const categoriesApi = {
  getAll: () =>
    client.get<ApiResponse<CategoryDto[]>>('/categories').then((r) => r.data),

  getById: (id: string) =>
    client.get<ApiResponse<CategoryDto>>(`/categories/${id}`).then((r) => r.data),
};
