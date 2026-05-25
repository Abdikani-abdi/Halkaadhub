/**
 * Centralized API Configuration
 * 
 * This file contains all API-related configuration constants.
 * Update the BASE_URL here to change the backend server for the entire application.
 */

// Backend server base URL - Change this to switch environments
// For production, use HTTPS. Update this URL once SSL is configured on the backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://178.18.245.131:8080';

// API endpoints prefix
export const API_PREFIX = '/api';

// Full API URL (base + prefix)
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// SignalR/WebSocket hubs URL
export const HUBS_URL = `${API_BASE_URL}/hubs`;

// Individual hub endpoints
export const CHAT_HUB_URL = `${HUBS_URL}/chat`;
export const NOTIFICATIONS_HUB_URL = `${HUBS_URL}/notifications`;

// Export configuration object for convenience
export const apiConfig = {
  baseUrl: API_BASE_URL,
  apiUrl: API_URL,
  hubsUrl: HUBS_URL,
  chatHubUrl: CHAT_HUB_URL,
  notificationsHubUrl: NOTIFICATIONS_HUB_URL,
} as const;

export default apiConfig;
