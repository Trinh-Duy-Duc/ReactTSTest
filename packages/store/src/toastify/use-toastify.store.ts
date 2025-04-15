import { create } from "zustand";
import { ToastifyState } from "./toastify.type";
import { TypeOptions } from "react-toastify";

const useToastify = create<ToastifyState>((set) => ({
    message: '',
    status: 'success',
    showToast: (status: TypeOptions, message: string) => set({ message, status })
}));

export { useToastify };