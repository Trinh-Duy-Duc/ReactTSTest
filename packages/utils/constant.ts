import { LanguageCode } from "@repo/types/enum";
import { ToastPosition } from "react-toastify";

const DEFAUL_VALUES = {
    language: LanguageCode.VietNam
}

const TRANS_KEYS = {
    common: 'common'
}

const LOCALSTORAGE_KEYS = {
    auth: 'auth-storage',
    dashboardLayout: 'dashboard-layout'
}
const COOKIE_KEYS = {
    lang: 'lang',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken'
}

const TOAST_CONFIGS = {
    position: "top-right" as ToastPosition,
    closeTime: 3000,
}


const REPO_CONSTANT = {
    DEFAUL_VALUES, TRANS_KEYS, LOCALSTORAGE_KEYS, COOKIE_KEYS, TOAST_CONFIGS
}

export default REPO_CONSTANT;