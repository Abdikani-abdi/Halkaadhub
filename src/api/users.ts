import client from './client';
import type { ApiResponse, UserProfileDto, UpdateProfileDto } from '@/types';

export const usersApi = {
  getMyProfile: () =>
    client.get<ApiResponse<UserProfileDto>>('/users/me').then((r) => r.data),

  updateProfile: (dto: UpdateProfileDto) =>
    client.put<ApiResponse<UserProfileDto>>('/users/me', dto).then((r) => r.data),

  getUser: (id: string) =>
    client.get<ApiResponse<UserProfileDto>>(`/users/${id}`).then((r) => r.data),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return client
      .post<ApiResponse<string>>('/users/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
