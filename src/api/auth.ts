import client from './client';
import type {
  ApiResponse,
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '@/types';

export const authApi = {
  login: (dto: LoginDto) =>
    client.post<ApiResponse<AuthResponseDto>>('/auth/login', dto).then((r) => r.data),

  register: (dto: RegisterDto) =>
    client.post<ApiResponse<AuthResponseDto>>('/auth/register', dto).then((r) => r.data),

  refresh: (refreshToken: string) =>
    client.post<ApiResponse<AuthResponseDto>>('/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: (refreshToken: string) =>
    client.post<ApiResponse<boolean>>('/auth/logout', { refreshToken }).then((r) => r.data),

  forgotPassword: (dto: ForgotPasswordDto) =>
    client.post<ApiResponse<string>>('/auth/forgot-password', dto).then((r) => r.data),

  resetPassword: (dto: ResetPasswordDto) =>
    client.post<ApiResponse<boolean>>('/auth/reset-password', dto).then((r) => r.data),
};
