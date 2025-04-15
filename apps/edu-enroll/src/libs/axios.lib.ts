import env from '@edu-enroll/services/env.service';
import { useAuthStore } from '@repo/store/auth';
import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: env.VITE_BACKEND_API_ENDPOINT,
});

// Thêm auth token vào mỗi request
axiosInstance.interceptors.request.use((config) => {
    const _accessToken = useAuthStore.getState().accessToken;
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
});
  
// Xử lý lỗi global
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // refresh token hoặc logout
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);