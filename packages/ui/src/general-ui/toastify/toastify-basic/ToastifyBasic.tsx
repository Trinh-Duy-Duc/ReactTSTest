import { useToastify } from '@repo/store/toastify';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import REPO_CONSTANT from '@repo/utils/constant';

const { TOAST_CONFIGS } = REPO_CONSTANT;

const ToastifyBasic = () => {
  const { message, status } = useToastify();

  useEffect(() => {
    if(!message) return;

    toast(message, { type: status });

  }, [message])

  return (
    <ToastContainer
      position={TOAST_CONFIGS.position}
      autoClose={TOAST_CONFIGS.closeTime} 
      hideProgressBar={false} 
      newestOnTop={false} 
      closeOnClick 
      rtl={false} 
      pauseOnFocusLoss 
      draggable 
      pauseOnHover 
    />
  )
}

export default ToastifyBasic