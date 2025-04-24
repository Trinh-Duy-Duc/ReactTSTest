import { repoAuthApi } from "@repo/services";
import { useAuthStore } from "@repo/store/auth";
import { ResponseBase } from "@repo/types/base";
import { LoginBody, LoginResponse } from "@repo/types/domain";

export function useAuth(){
    const { onLoginSuccess, onClearAuth } = useAuthStore();

    const handleLogin = async (body: LoginBody, callback?: (result: ResponseBase<LoginResponse>) => void) => {
        try{
            const resp = await repoAuthApi.loginApi(body);
            // authCommon.setTokenToCookie(resp.data);
            onLoginSuccess(resp.data);
            if(callback){
                callback(resp);
            }
        }catch{
            // handle error
            onClearAuth();
        }
    }

    const handleLogout = async (callback?: () => void) => {
        // call api signout
        onClearAuth();
        if(callback){
            callback();
        }
    }

    return {
        handleLogin, handleLogout
    }
}