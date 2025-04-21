type LoginBody = {
    userNameOrEmail: string;
    password: string
}
type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpired: Date;
    refreshTokenExpired: Date;
}

export type { LoginBody, LoginResponse }