import axios from 'axios';

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Attach Authorization Bearer token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('naam_uzhavar_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const token = parsed?.token || parsed?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // Ignore token read errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
