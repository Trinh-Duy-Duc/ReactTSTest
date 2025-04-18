import { repoAuthApi } from '@repo/services';
import { ResponseBase } from '@repo/types/base';
import { LoginBody, LoginResponse } from '@repo/types/domain';
import REPO_CONSTANT from '@repo/utils/constant';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './auth.type';
import Cookies from 'js-cookie';

const { COOKIE_KEYS, LOCALSTORAGE_KEYS } = REPO_CONSTANT;

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      initAuth: () => {
        const _accessToken = Cookies.get(COOKIE_KEYS.accessToken);
        const _refreshToken = Cookies.get(COOKIE_KEYS.refreshToken);

        if(_accessToken){
          set({ accessToken: _accessToken, refreshToken: _refreshToken });
          get().getUserInfo();
        }else{
          Cookies.remove(COOKIE_KEYS.refreshToken);
          set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
        }
      },
      login: async (body: LoginBody, callback?: (result: ResponseBase<LoginResponse>) => void) => {
        // call api
        try{
          const resp = await repoAuthApi.loginApi(body);
          const { accessToken, refreshToken, user } = resp.data;

          Cookies.set(COOKIE_KEYS.accessToken, accessToken, { expires: 1 });
          Cookies.set(COOKIE_KEYS.refreshToken, refreshToken, { expires: 7 });

          set({ accessToken, refreshToken, user, isAuthenticated: true });

          if(callback){
            callback(resp);
          }
        }catch(err){
          // handle error
        }
      },
      getUserInfo: async () => {
        try {
          const resp = await repoAuthApi.userInfoApi();
          
          set({ user: resp.data.user, isAuthenticated: true });
        } catch (error) {
          get().logout();
        }
      },
      logout: () => {
        Cookies.remove(COOKIE_KEYS.accessToken);
        Cookies.remove(COOKIE_KEYS.refreshToken);
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
      }
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
