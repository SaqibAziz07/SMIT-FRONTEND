// Centralized API Configuration
// Uses environment variable with fallback to localhost

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  REQUESTS: `${API_BASE_URL}/api/requests`,
  USERS: `${API_BASE_URL}/api/users`,
  MESSAGES: `${API_BASE_URL}/api/messages`,
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  AI: `${API_BASE_URL}/api/ai`,
};

export default API_BASE_URL;
