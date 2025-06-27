import { toast } from 'sonner';

export const showToast = {
  success: (title: string, description?: string) => {
    toast.success(title, { description });
  },
  
  error: (title: string, description?: string) => {
    toast.error(title, { description });
  },
  
  info: (title: string, description?: string) => {
    toast.info(title, { description });
  },
  
  warning: (title: string, description?: string) => {
    toast.warning(title, { description });
  },
  
  loading: (title: string, description?: string) => {
    return toast.loading(title, { description });
  },
  
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  }
}; 