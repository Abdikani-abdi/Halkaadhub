// API Client and Configuration
export { default as client, API_BASE_URL } from './client';

// API Services
export { authApi } from './auth';
export { adminApi } from './admin';
export { categoriesApi } from './categories';
export { chatsApi } from './chats';
export { foundItemsApi } from './foundItems';
export { lostItemsApi } from './lostItems';
export { matchesApi } from './matches';
export { notificationsApi } from './notifications';
export { reportsApi } from './reports';
export { usersApi } from './users';

// Re-export config for convenience
export { API_BASE_URL as BASE_URL, API_URL, HUBS_URL, apiConfig } from '@/config/api';
