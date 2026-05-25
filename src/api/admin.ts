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

export interface CreateUserDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: 'User' | 'Manager' | 'Admin';
}

export const adminApi = {
  getDashboard: () =>
    client.get<ApiResponse<DashboardDto>>('/admin/dashboard').then((r) => r.data),

  getUsers: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<AdminUserDto>>('/admin/users', { params: { page, pageSize } }).then((r) => r.data),

  createUser: (dto: CreateUserDto) =>
    client.post<ApiResponse<AdminUserDto>>('/admin/users', dto).then((r) => r.data),

  banUser: (id: string) =>
    client.post<ApiResponse<boolean>>(`/admin/users/${id}/ban`).then((r) => r.data),

  unbanUser: (id: string) =>
    client.post<ApiResponse<boolean>>(`/admin/users/${id}/unban`).then((r) => r.data),

  getReports: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<ReportDto>>('/admin/reports', { params: { page, pageSize } }).then((r) => r.data),

  createCategory: (dto: CreateCategoryDto) =>
    client.post<ApiResponse<CategoryDto>>('/admin/categories', dto).then((r) => r.data),
};
