import { repoAxiosInternalMethod, repoAxiosInternalInstance } from '@repo/libs';

repoAxiosInternalInstance.interceptors.request.use();
repoAxiosInternalInstance.interceptors.response.use();

const eeAxiosInstance = {
  ... repoAxiosInternalMethod
}

export { eeAxiosInstance };