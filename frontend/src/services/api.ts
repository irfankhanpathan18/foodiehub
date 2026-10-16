import axios from 'axios';

// Get API base URL from Vite environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodiehub_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if server rejects it
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/orders') || currentPath.startsWith('/checkout') || currentPath.startsWith('/admin')) {
        localStorage.removeItem('foodiehub_token');
        localStorage.removeItem('foodiehub_user');
      }
    }
    return Promise.reject(error);
  }
);
