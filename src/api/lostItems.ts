import client from './client';
import type {
  ApiResponse,
  PagedResponse,
  LostItemDto,
  CreateLostItemDto,
  UpdateLostItemDto,
  LostItemSearchParams,
} from '@/types';

export const lostItemsApi = {
  getAll: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<LostItemDto>>('/lost-items', { params: { page, pageSize } }).then((r) => r.data),

  getById: (id: string) =>
    client.get<ApiResponse<LostItemDto>>(`/lost-items/${id}`).then((r) => r.data),

  create: (dto: CreateLostItemDto) =>
    client.post<ApiResponse<LostItemDto>>('/lost-items', dto).then((r) => r.data),

  update: (id: string, dto: UpdateLostItemDto) =>
    client.put<ApiResponse<LostItemDto>>(`/lost-items/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    client.delete<ApiResponse<boolean>>(`/lost-items/${id}`).then((r) => r.data),

  recover: (id: string) =>
    client.post<ApiResponse<boolean>>(`/lost-items/${id}/recover`).then((r) => r.data),

  search: (params: LostItemSearchParams) =>
    client.get<PagedResponse<LostItemDto>>('/lost-items/search', { params }).then((r) => r.data),

  addImages: (id: string, imageUrls: string[]) =>
    client.post<ApiResponse<string[]>>(`/lost-items/${id}/images`, imageUrls).then((r) => r.data),
};
