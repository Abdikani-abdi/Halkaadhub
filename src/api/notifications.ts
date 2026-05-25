import client from './client';
import type { ApiResponse, PagedResponse, NotificationDto } from '@/types';

export const notificationsApi = {
  getAll: (page = 1, pageSize = 20) =>
    client.get<PagedResponse<NotificationDto>>('/notifications', { params: { page, pageSize } }).then((r) => r.data),

  markAsRead: (id: string) =>
    client.post<ApiResponse<boolean>>(`/notifications/read/${id}`).then((r) => r.data),
};
