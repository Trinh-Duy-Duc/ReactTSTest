import { repoAxiosInternal } from '@repo/libs';
import { LoginBody, LoginResponse, UserInfoRespone } from '@repo/types/domain';

const loginApi = async (body: LoginBody) => {
    const resp = await repoAxiosInternal._post<LoginResponse>('/auth/login', body);
    return resp;
}
const userInfoApi = async () =>{
    const resp = await repoAxiosInternal._get<UserInfoRespone>('/auth/userinfo');
    return resp;
}

const repoAuthApi = {
    loginApi, userInfoApi
}

export { repoAuthApi };