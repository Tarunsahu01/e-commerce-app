/**
 * Axios instance with JWT interceptor for backend integration.
 *
 * Architecture: Single axios instance ensures consistent config across all API calls.
 * Uses Vite proxy in dev (/api -> localhost:8080) to avoid CORS; in prod, set VITE_API_URL.
 *
 * JWT Flow: Request interceptor attaches Bearer token from localStorage when present.
 * Response interceptor handles 401 by clearing auth state (token expired/invalid).
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT to every request; backend expects: Authorization: Bearer <token>
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401, token is invalid/expired - clear storage; AuthContext will handle redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch custom event for AuthContext to react (avoids circular import)
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);
