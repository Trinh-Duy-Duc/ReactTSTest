import { User } from '@repo/types/api';
import { LoginResponse } from '@repo/types/domain';

type AuthState = {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;

    onSetToken: (accessToken: string, refreshToken: string) => void;
    onLoginSuccess: (response: LoginResponse) => void;
    onClearAuth: () => void;
    onSetUser: (user: User) => void;

    // initAuth: () => void;
    // login: (body: LoginBody, callback?: (result: ResponseBase<LoginResponse>) => void) => Promise<void>;
    // handleRefreshToken: () => Promise<void>;
    // getUserInfo: () => Promise<void>;
    // logout: () => void;
}

export type { AuthState };
