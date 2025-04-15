type ResponseBase<T> = {
    data: T;
    success: boolean;
    message: string;
}

export {
    ResponseBase
}