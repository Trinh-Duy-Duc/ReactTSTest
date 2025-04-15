import { User } from '@repo/types/api';

type AuthState = {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    setAuth: (accessToken: string, refreshToken: string, user: User) => void;
    clearAuth: () => void;
}

export type { AuthState };