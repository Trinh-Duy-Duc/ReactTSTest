import { envRepo } from '@repo/env';
import { ResponseBase } from '@repo/types/base';
import axios, { AxiosRequestConfig } from 'axios';

const _repoAxiosInternal = axios.create({
    baseURL: envRepo.VITE_BACKEND_API_ENDPOINT,
});

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
    const resp = await _repoAxiosInternal.get<ResponseBase<T>>(path, config);
    return resp.data;
}
const _post = async <T>(path: string, body: any, config?: AxiosRequestConfig) => {
    const resp = await _repoAxiosInternal.post<ResponseBase<T>>(path, body, config);
    return resp.data;
}
const _put = async <T>(path: string, body: any, config?: AxiosRequestConfig) => {
    const resp = await _repoAxiosInternal.put<ResponseBase<T>>(path, body, config);
    return resp.data;
}
const _delete = async <T>(path: string, config?: AxiosRequestConfig) => {
    const resp = await _repoAxiosInternal.delete<ResponseBase<T>>(path, config);
    return resp.data;
}

const repoAxiosInternal = {
    _get, _post, _put, _delete
}

export { repoAxiosInternal };
