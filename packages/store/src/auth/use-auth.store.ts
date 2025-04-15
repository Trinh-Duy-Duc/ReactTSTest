import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './auth.type';
import { User } from '@repo/types/api';
import REPO_CONSTANT from '@repo/utils/constant';

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken: string, refreshToken: string, user: User) => set({ accessToken, refreshToken, user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
    }),
    {
      name: REPO_CONSTANT.LOCALSTORAGE_KEYS.auth
    }
  )
)

export { useAuthStore };