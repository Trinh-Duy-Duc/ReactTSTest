type ResponseBase<T> = {
    data: T;
    success: boolean;
    error: string;
}

export type {
    ResponseBase
}