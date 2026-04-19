import axios from 'axios';
import API_BASE_URL from './api.js';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - Clearing local data and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?redirect=' + window.location.pathname;
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('❌ Forbidden - You do not have permission to perform this action');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('❌ Server Error - Please try again later');
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - Server is not responding');
    }

    if (!error.response && !error.code === 'ECONNABORTED') {
      console.error('❌ Network error - Please check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
