import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { API_BASE_URL, API_URL } from '@/config/api';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          if (data.success && data.data) {
            useAuthStore.getState().setAuth(data.data);
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return client(originalRequest);
          }
        } catch {
          useAuthStore.getState().logout();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Re-export for backward compatibility
export { API_BASE_URL };
export default client;
