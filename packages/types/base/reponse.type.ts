type ResponseBase<T> = {
    data: T;
    success: boolean;
    message: string;
}

export type {
    ResponseBase
}