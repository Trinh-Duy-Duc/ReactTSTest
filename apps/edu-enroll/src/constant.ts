import REPO_CONSTANT from '@repo/utils/constant';

const ROUTE = {
    fallBackRoot: `/${REPO_CONSTANT.DEFAUL_VALUES.language}`,
    fallBackInside: `/${REPO_CONSTANT.DEFAUL_VALUES.language}/login`,
}

const TRAN_KEYS_PREFIX = {
    login: "auth.login"
}

const EE_CONSTANT = {
    ...REPO_CONSTANT, ROUTE, TRAN_KEYS_PREFIX
}

export default EE_CONSTANT;