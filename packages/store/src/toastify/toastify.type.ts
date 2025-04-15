import { TypeOptions } from 'react-toastify';

type ToastifyState = {
    message: string;
    status: TypeOptions;
    showToast: (status: TypeOptions, message: string) => void;
}

export type { ToastifyState };