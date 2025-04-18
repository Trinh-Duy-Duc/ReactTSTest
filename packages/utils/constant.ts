import { LanguageCode } from "@repo/types/enum";
import { ToastPosition } from "react-toastify";

const DEFAUL_VALUES = {
    language: LanguageCode.VietNam
}

const TRANS_KEYS = {
    common: 'common'
}

const LOCALSTORAGE_KEYS = {
    auth: 'auth-storage'
}
const COOKIE_KEYS = {
    lang: 'lang'
}

const TOAST_CONFIGS = {
    position: "top-right" as ToastPosition,
    closeTime: 3000,
}


const REPO_CONSTANT = {
    DEFAUL_VALUES, TRANS_KEYS, LOCALSTORAGE_KEYS, COOKIE_KEYS, TOAST_CONFIGS
}

export default REPO_CONSTANT;