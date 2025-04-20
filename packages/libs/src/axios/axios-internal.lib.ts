import { envRepo } from '@repo/env';
import { ResponseBase } from '@repo/types/base';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@repo/store/auth';

const repoAxiosInternalInstance = axios.create({
    baseURL: envRepo.VITE_BACKEND_ENDPOINT,
});

repoAxiosInternalInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            // Thêm Bearer token vào header Authorization
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
      return response;  // Nếu response thành công, trả về bình thường
    },
    async (error) => {
      const originalRequest = error.config;
  
      // Kiểm tra xem có phải lỗi 401 không (token hết hạn)
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          // Lấy access token mới từ refresh token
          await useAuthStore.getState().handleRefreshToken();
          
          // Cập nhật lại access token trong header
          originalRequest.headers['Authorization'] = `Bearer ${useAuthStore.getState().accessToken}`;
  
          // Thực hiện lại request ban đầu với access token mới
          return axios(originalRequest);
        } catch (refreshError) {
          // Nếu không refresh được token, có thể thực hiện logout hoặc redirect
          return Promise.reject(refreshError);
        }
      }
  
      // Nếu không phải lỗi 401 hoặc không thể refresh, trả về lỗi gốc
      return Promise.reject(error);
    }
  );

// Xử lý error response
// _axiosInternal.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     (error: AxiosError) => {
//         if (error.response) {
//             // Lỗi 4xx, 5xx từ server
            
//         } else if (error.request) {
//             // Request đã được gửi nhưng không có response
//             return Promise.reject(new Error('No response received from server'));
//         } else {
//             // Lỗi khi thiết lập request
//             return Promise.reject(new Error(error.message));
//         }
//     }
// );

const _get = async <T>(path: string, config?: AxiosRequestConfig) => {
    const resp = await repoAxiosInternalInstance.get<ResponseBase<T>>(path, config);
    return resp.data;
}
const _post = async <T>(path: string, body: any, config?: AxiosRequestConfig) => {
    const resp = await repoAxiosInternalInstance.post<ResponseBase<T>>(path, body, config);
    return resp.data;
}
const _put = async <T>(path: string, body: any, config?: AxiosRequestConfig) => {
    const resp = await repoAxiosInternalInstance.put<ResponseBase<T>>(path, body, config);
    return resp.data;
}
const _delete = async <T>(path: string, config?: AxiosRequestConfig) => {
    const resp = await repoAxiosInternalInstance.delete<ResponseBase<T>>(path, config);
    return resp.data;
}

const repoAxiosInternalMethod = {
    _get, _post, _put, _delete
}

export { repoAxiosInternalInstance, repoAxiosInternalMethod };
