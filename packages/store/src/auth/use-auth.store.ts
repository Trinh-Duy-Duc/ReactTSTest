import { User } from '@repo/types/api';
import REPO_CONSTANT from '@repo/utils/constant';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './auth.type';
import { LoginResponse } from '@repo/types/domain';
import { authCommon } from '@repo/utils/auth';
import { jwtDecode } from "jwt-decode";
import { dateCommon } from '@repo/utils/date';

const { LOCALSTORAGE_KEYS } = REPO_CONSTANT;

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      onSetToken: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        const accessTokenDecoded = jwtDecode(accessToken);
        const _accessTokenExpired = dateCommon.timestampToDate(accessTokenDecoded.exp!);
        // const _refreshTokenExpired = _accessTokenExpired.setDate()
        authCommon.setTokenToCookie({ accessToken, refreshToken, accessTokenExpired: _accessTokenExpired, refreshTokenExpired: _accessTokenExpired });
      },
      onLoginSuccess: (response: LoginResponse) => {
        const { accessToken, refreshToken } = response;
        set({ accessToken, refreshToken });
        authCommon.setTokenToCookie(response);
      },
      onClearAuth: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false, user: null }),
      onSetUser: (user: User) => set({ user, isAuthenticated: true }),
    }),
    {
      name: LOCALSTORAGE_KEYS.auth,
      // chỉ persistence user và isAuthenticated trong localstorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

export { useAuthStore };

