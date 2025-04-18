import { User } from "@repo/types/api";

type LoginBody = {
    username: string;
    password: string
}
type LoginResponse = {
    fullName: string;
    accessToken: string;
    refreshToken: string;
    user: User
}
type UserInfoRespone = {
    user: User
}

export type { LoginBody, LoginResponse, UserInfoRespone }