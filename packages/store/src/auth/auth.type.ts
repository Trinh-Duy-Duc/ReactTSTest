import { User } from '@repo/types/api';
import { LoginBody, LoginResponse } from '@repo/types/domain';
import { ResponseBase } from '@repo/types/base';

type AuthState = {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    initAuth: () => void;
    login: (body: LoginBody, callback?: (result: ResponseBase<LoginResponse>) => void) => Promise<void>;
    handleRefreshToken: () => Promise<void>;
    getUserInfo: () => Promise<void>;
    logout: () => void;
}

export type { AuthState };