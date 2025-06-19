import Toast from 'react-native-toast-message';

interface ToastOptions {
  text1: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
  props?: any;
}

export const showToast = {
  success: (options: ToastOptions) => {
    Toast.show({
      type: 'success',
      ...options,
    });
  },

  error: (options: ToastOptions) => {
    Toast.show({
      type: 'error',
      ...options,
    });
  },

  info: (options: ToastOptions) => {
    Toast.show({
      type: 'info',
      ...options,
    });
  },

  warning: (options: ToastOptions) => {
    Toast.show({
      type: 'warning',
      ...options,
    });
  },

  cookie: (options: ToastOptions) => {
    Toast.show({
      type: 'cookie',
      ...options,
    });
  },
};

export const hideToast = () => {
  Toast.hide();
};

// Quick methods for common use cases
export const toast = {
  success: (message: string, subtitle?: string) => 
    showToast.success({ text1: message, text2: subtitle }),

  error: (message: string, subtitle?: string) => 
    showToast.error({ text1: message, text2: subtitle }),

  info: (message: string, subtitle?: string) => 
    showToast.info({ text1: message, text2: subtitle }),

  warning: (message: string, subtitle?: string) => 
    showToast.warning({ text1: message, text2: subtitle }),

  cookie: (message: string, subtitle?: string) => 
    showToast.cookie({ text1: message, text2: subtitle }),

  hide: hideToast,
}; 