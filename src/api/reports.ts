import client from './client';
import type { ApiResponse, ReportDto, CreateReportDto } from '@/types';

export const reportsApi = {
  create: (dto: CreateReportDto) =>
    client.post<ApiResponse<ReportDto>>('/reports', dto).then((r) => r.data),
};
