import { View, Text } from 'react-native';
import { BaseToast, type ToastConfig } from 'react-native-toast-message';

export const toaster: ToastConfig = {
  cookie: (props) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#f8e8c4',
        borderLeftColor: '#f8e8c4',
      }}
    />
  ),
};
