import { useState, useCallback } from 'react';

type ToastMessage = {
  id: number;
  type: 'info' | 'success';
  text: string;
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = new Date().getTime(); // Unique ID for each toast
    setToasts((prevToasts) => [...prevToasts, { ...message, id }]);

    // Set a timer to remove the toast after 3 seconds
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return { toasts, addToast, removeToast };
};