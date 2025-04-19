import REPO_CONSTANT from '@repo/utils/constant';

const ROUTE = {
    fallBackRoot: `/${REPO_CONSTANT.DEFAUL_VALUES.language}`,
    fallBackInside: `/${REPO_CONSTANT.DEFAUL_VALUES.language}/login`,
}

const TRAN_KEYS_PREFIX = {
    login: "auth.login"
}

const QUERY_KEYS = {
    auth: {

    },
    // feature 2 object
    // feature 3 object
}

const EE_CONSTANT = {
    ...REPO_CONSTANT, ROUTE, TRAN_KEYS_PREFIX, QUERY_KEYS
}

export default EE_CONSTANT;