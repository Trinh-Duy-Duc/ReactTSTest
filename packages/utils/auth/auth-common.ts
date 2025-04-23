import { LoginResponse } from "@repo/types/domain";
import Cookies from 'js-cookie';
import REPO_CONSTANT from "../constant";
import { dateCommon }  from '../date';

const { COOKIE_KEYS } = REPO_CONSTANT;

const getAccessTokenFromCookie = () => Cookies.get(COOKIE_KEYS.accessToken);
const getRefreshTokenFromCookie = () => Cookies.get(COOKIE_KEYS.refreshToken);
const deleteRefreshTokenInCookie = () => Cookies.remove(COOKIE_KEYS.refreshToken);

const setTokenToCookie = (body: LoginResponse) => {
    const { accessToken, accessTokenExpired, refreshToken, refreshTokenExpired } = body;
    Cookies.set(COOKIE_KEYS.accessToken, accessToken, { expires: dateCommon.calculateRoundedDaysFromNow(accessTokenExpired) });
    Cookies.set(COOKIE_KEYS.refreshToken, refreshToken, { expires: dateCommon.calculateRoundedDaysFromNow(refreshTokenExpired) });
}

const authCommon = {
    getAccessTokenFromCookie, getRefreshTokenFromCookie, deleteRefreshTokenInCookie, setTokenToCookie
}

export { authCommon };