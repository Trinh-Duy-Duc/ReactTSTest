import { User } from '@repo/types/api';
import REPO_CONSTANT from '@repo/utils/constant';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './auth.type';
import { LoginResponse } from '@repo/types/domain';
import { authCommon } from '@repo/utils/auth';

const { LOCALSTORAGE_KEYS } = REPO_CONSTANT;

// const setTokenToCookie = (body: LoginResponse) => {
//   const { accessToken, accessTokenExpired, refreshToken, refreshTokenExpired } = body;
//   Cookies.set(COOKIE_KEYS.accessToken, accessToken, { expires: 1 });
//   Cookies.set(COOKIE_KEYS.refreshToken, refreshToken, { expires: 7 });
// }

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      onSetToken: (accessToken: string, refreshToken: string) => set({ accessToken, refreshToken }),
      onLoginSuccess: (response: LoginResponse) => {
        const { accessToken, refreshToken } = response;
        set({ accessToken, refreshToken, isAuthenticated: true });
        authCommon.setTokenToCookie(response);
      },
      onClearAuth: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null }),
      onSetUser: (user: User) => set({ user, isAuthenticated: true }),
      // initAuth: () => {
      //   const _accessToken = Cookies.get(COOKIE_KEYS.accessToken);
      //   const _refreshToken = Cookies.get(COOKIE_KEYS.refreshToken);

      //   if(_accessToken){
      //     set({ accessToken: _accessToken, refreshToken: _refreshToken });
      //     get().getUserInfo();
      //   }else{
      //     Cookies.remove(COOKIE_KEYS.refreshToken);
      //     set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
      //   }
      // },
      // login: async (body: LoginBody, callback?: (result: ResponseBase<LoginResponse>) => void) => {
      //   // call api
      //   try{
      //     const resp = await repoAuthApi.loginApi(body);
      //     const { accessToken, refreshToken, accessTokenExpired, refreshTokenExpired } = resp.data;

      //     setTokenToCookie(resp.data);

      //     set({ accessToken, refreshToken, isAuthenticated: true });
      //     get().getUserInfo();

      //     if(callback){
      //       callback(resp);
      //     }
      //   }catch(err){
      //     // handle error
      //     get().logout();
      //   }
      // },
      // handleRefreshToken: async () =>{
      //   const { refreshToken, logout } = get();
      //   if(!refreshToken){
      //     logout();
      //     return;
      //   }
      //   try{
      //     const resp = await repoAuthApi.refreshTokenApi(refreshToken);
      //     const { accessToken, refreshToken: _refreshToken } = resp.data;

      //     setTokenToCookie(resp.data);

      //     set({ accessToken, refreshToken: _refreshToken, isAuthenticated: true });
      //   }catch{
      //     // handle error
      //     logout();
      //   }
      // },
      // getUserInfo: async () => {
      //   try {
      //     const resp = await repoAuthApi.userInfoApi();
          
      //     set({ user: resp.data, isAuthenticated: true });
      //   } catch (error) {
      //     get().logout();
      //   }
      // },
      // logout: () => {
      //   Cookies.remove(COOKIE_KEYS.accessToken);
      //   Cookies.remove(COOKIE_KEYS.refreshToken);
      //   set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
      // }
    }),
    {
      name: LOCALSTORAGE_KEYS.auth,
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

export { useAuthStore };

