import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import Toast from 'react-native-toast-message';

export const useExitOnTwoBack = () => {
  const router = useRouter();
  const [backPressCount, setBackPressCount] = useState(0);
  const backPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBackPress = useCallback(() => {
    if (backPressCount === 1) {
      // Second press - exit app
      setBackPressCount(0);
      if (backPressTimeoutRef.current) {
        clearTimeout(backPressTimeoutRef.current);
        backPressTimeoutRef.current = null;
      }
      BackHandler.exitApp();
      return true;
    } else {
      // First press - show toast and set timeout
      setBackPressCount(1);
      Toast.show({
        text1: 'Press back again to exit',
        position: 'bottom',
        visibilityTime: 2000,
      });

      // Clear any existing timeout
      if (backPressTimeoutRef.current) {
        clearTimeout(backPressTimeoutRef.current);
      }

      // Set new timeout to reset counter
      backPressTimeoutRef.current = setTimeout(() => {
        setBackPressCount(0);
        backPressTimeoutRef.current = null;
      }, 2000);

      return true;
    }
  }, [backPressCount]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Set router params to disable default back behavior
    router.setParams({ backBehavior: 'none' });

    return () => {
      backHandler.remove();
      if (backPressTimeoutRef.current) {
        clearTimeout(backPressTimeoutRef.current);
        backPressTimeoutRef.current = null;
      }
    };
  }, [router, handleBackPress]);
};
