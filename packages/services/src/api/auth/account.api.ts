import { repoAxiosInternalMethod } from '@repo/libs';
import { User } from '@repo/types/api';
import { LoginBody, LoginResponse } from '@repo/types/domain';

const _controllerPath = '/auth/api/Account';

const mergePath = (path: string) => `${_controllerPath}${path}`

const loginApi = async (body: LoginBody) => {
    const resp = await repoAxiosInternalMethod._post<LoginResponse>(mergePath('/Login'), body);
    return resp;
}
const refreshTokenApi = async (refreshToken: string) => {
    const resp = await repoAxiosInternalMethod._post<LoginResponse>(mergePath('/RefreshToken'), { refreshToken });
    return resp;
}
const userInfoApi = async () =>{
    const resp = await repoAxiosInternalMethod._get<User>(mergePath('/GetProfile'));
    return resp;
}


const repoAuthApi = {
    loginApi, refreshTokenApi, userInfoApi
}

export { repoAuthApi };