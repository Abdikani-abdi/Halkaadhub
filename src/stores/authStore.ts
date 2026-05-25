import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponseDto, UserMinimalDto } from '@/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserMinimalDto | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponseDto) => void;
  logout: () => void;
  updateUser: (user: Partial<UserMinimalDto>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (data: AuthResponseDto) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: 'halkaadhub-auth' }
  )
);
