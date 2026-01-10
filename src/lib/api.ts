import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('payflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (token expired/invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      try {
        const token = localStorage.getItem('payflow_token');
        if (token) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.token) {
            localStorage.setItem('payflow_token', response.data.token);
            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            }
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        localStorage.removeItem('payflow_token');
        localStorage.removeItem('payflow_user');
        window.location.hash = '';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
