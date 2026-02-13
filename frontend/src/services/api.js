import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_URL: API_URL
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
  timeout: 550000, // 55 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🔵 API Request:', config.method.toUpperCase(), config.url);
    
    // Debug student creation requests
    if (config.url === '/students' && config.method === 'post') {
      console.log('🔍 FRONTEND SENDING DATA:', JSON.stringify(config.data, null, 2));
      console.log('🔑 Password in request:', config.data?.password ? `${config.data.password.length} chars` : 'MISSING');
    }
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('🟢 API Response:', response.config.url, response.status);
    return response.data;
  },
  async (error) => {
    console.error('🔴 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    const originalRequest = error.config;

    // Handle expired token (401 or 500 with "Access token expired" message)
    const isTokenExpired = 
      error.response?.status === 401 || 
      (error.response?.status === 500 && error.response?.data?.message?.includes('Access token expired'));

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        console.error('🔴 Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
