import { LoginResponse } from "@repo/types/domain";
import Cookies from 'js-cookie';
import REPO_CONSTANT from "../constant";
import dayjs from "dayjs";

const { COOKIE_KEYS } = REPO_CONSTANT;

const getAccessTokenFromCookie = () => Cookies.get(COOKIE_KEYS.accessToken);
const getRefreshTokenFromCookie = () => Cookies.get(COOKIE_KEYS.refreshToken);
const deleteRefreshTokenInCookie = () => Cookies.remove(COOKIE_KEYS.refreshToken);

const calculateRoundedDaysFromNow = (date: Date) => {
    // Tính số giờ từ ngày truyền vào đến hiện tại
    const diffInHours = dayjs().diff(dayjs(date), 'hour');
    
    // Chuyển giờ thành ngày và làm tròn lên
    const days = diffInHours / 24;
    
    // Làm tròn lên
    const roundedDays = Math.ceil(days);
    
    return roundedDays;
}

const setTokenToCookie = (body: LoginResponse) => {
    const { accessToken, accessTokenExpired, refreshToken, refreshTokenExpired } = body;
    Cookies.set(COOKIE_KEYS.accessToken, accessToken, { expires: calculateRoundedDaysFromNow(accessTokenExpired) });
    Cookies.set(COOKIE_KEYS.refreshToken, refreshToken, { expires: calculateRoundedDaysFromNow(refreshTokenExpired) });
}

const authCommon = {
    getAccessTokenFromCookie, getRefreshTokenFromCookie, deleteRefreshTokenInCookie, setTokenToCookie
}

export { authCommon };