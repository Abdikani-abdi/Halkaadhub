import client from './client';
import type {
  ApiResponse,
  PagedResponse,
  DashboardDto,
  AdminUserDto,
  ReportDto,
  CreateCategoryDto,
  CategoryDto,
} from '@/types';

export const adminApi = {
  getDashboard: () =>
    client.get<ApiResponse<DashboardDto>>('/admin/dashboard').then((r) => r.data),

  getUsers: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<AdminUserDto>>('/admin/users', { params: { page, pageSize } }).then((r) => r.data),

  banUser: (id: string) =>
    client.post<ApiResponse<boolean>>(`/admin/users/${id}/ban`).then((r) => r.data),

  getReports: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<ReportDto>>('/admin/reports', { params: { page, pageSize } }).then((r) => r.data),

  createCategory: (dto: CreateCategoryDto) =>
    client.post<ApiResponse<CategoryDto>>('/admin/categories', dto).then((r) => r.data),
};
