import React from 'react';
import { Pressable } from 'react-native';
import { View } from './ui/view';
import { Text } from './ui/text';
import { type ToastConfig } from 'react-native-toast-message';
import { Check, X, AlertCircle, Info } from 'lucide-react-native';
import { useColorScheme } from '~/lib/useColorScheme';

interface CustomToastProps {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  props?: any;
}

const SuccessToast = ({ text1, text2, onPress, props }: CustomToastProps) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={`mx-4 mb-2 flex-row items-center rounded-xl px-4 py-3 shadow-lg ${
        isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: '80%',
      }}
    >
      <View className="mr-3 p-1.5">
        <Check size={16} color="#10b981" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className={`font-comfortaa-medium text-base ${
            isDarkColorScheme ? 'text-white' : 'text-gray-900'
          }`}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text className={`font-comfortaa-regular text-sm ${
            isDarkColorScheme ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const ErrorToast = ({ text1, text2, onPress, props }: CustomToastProps) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={`mx-4 mb-2 flex-row items-center rounded-xl px-4 py-3 shadow-lg ${
        isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: '80%',
      }}
    >
      <View className="mr-3 p-1.5">
        <X size={16} color="#ef4444" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className={`font-comfortaa-medium text-base ${
            isDarkColorScheme ? 'text-white' : 'text-gray-900'
          }`}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text className={`font-comfortaa-regular text-sm ${
            isDarkColorScheme ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const InfoToast = ({ text1, text2, onPress, props }: CustomToastProps) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={`mx-4 mb-2 flex-row items-center rounded-xl px-4 py-3 shadow-lg ${
        isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: '80%',
      }}
    >
      <View className="mr-3 p-1.5">
        <Info size={16} color="#3b82f6" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className={`font-comfortaa-medium text-base ${
            isDarkColorScheme ? 'text-white' : 'text-gray-900'
          }`}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text className={`font-comfortaa-regular text-sm ${
            isDarkColorScheme ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const WarningToast = ({ text1, text2, onPress, props }: CustomToastProps) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={`mx-4 mb-2 flex-row items-center rounded-xl border-l-4 border-amber-500 px-4 py-3 shadow-lg ${
        isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: '80%',
      }}
    >
      <View className="mr-3 p-1.5">
        <AlertCircle size={16} color="#f59e0b" />
      </View>
      <View className="flex-1">
        {text1 && (
          <Text className={`font-comfortaa-medium text-base ${
            isDarkColorScheme ? 'text-white' : 'text-gray-900'
          }`}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text className={`font-comfortaa-regular text-sm ${
            isDarkColorScheme ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text2}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export const toaster: ToastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
  info: (props) => <InfoToast {...props} />,
  warning: (props) => <WarningToast {...props} />,
};
