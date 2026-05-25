import client from './client';
import type {
  ApiResponse,
  PagedResponse,
  FoundItemDto,
  CreateFoundItemDto,
  UpdateFoundItemDto,
  FoundItemSearchParams,
} from '@/types';

export const foundItemsApi = {
  getAll: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<FoundItemDto>>('/found-items', { params: { page, pageSize } }).then((r) => r.data),

  getById: (id: string) =>
    client.get<ApiResponse<FoundItemDto>>(`/found-items/${id}`).then((r) => r.data),

  create: (dto: CreateFoundItemDto) =>
    client.post<ApiResponse<FoundItemDto>>('/found-items', dto).then((r) => r.data),

  update: (id: string, dto: UpdateFoundItemDto) =>
    client.put<ApiResponse<FoundItemDto>>(`/found-items/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    client.delete<ApiResponse<boolean>>(`/found-items/${id}`).then((r) => r.data),

  search: (params: FoundItemSearchParams) =>
    client.get<PagedResponse<FoundItemDto>>('/found-items/search', { params }).then((r) => r.data),

  addImages: (id: string, imageUrls: string[]) =>
    client.post<ApiResponse<string[]>>(`/found-items/${id}/images`, imageUrls).then((r) => r.data),
};
