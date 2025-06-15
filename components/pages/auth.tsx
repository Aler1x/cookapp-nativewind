import { useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Button } from '~/components/ui/button';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { GoogleIcon, AppleIcon } from '~/assets/icons';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function AuthPage() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const { startSSOFlow } = useSSO();

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      Toast.show({
        text1: 'Error signing in',
        type: 'error',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  }, [startSSOFlow]);

  const onApplePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_apple',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: 'Error signing in',
        type: 'error',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  }, [startSSOFlow]);

  return (
    <SafeAreaView className='flex-1 items-center justify-center gap-4 bg-background'>
      <Text className='text-xl font-bold'>Sign in to CookApp</Text>
      <Button onPress={onGooglePress} variant='black' className='w-60'>
        <View className='flex-row items-center gap-2'>
          <GoogleIcon width={20} height={20} />
          <Text className='text-white'>Sign in with Google</Text>
        </View>
      </Button>

      <Button onPress={onApplePress} variant='black' className='w-60'>
        <View className='flex-row items-center gap-2'>
          <AppleIcon width={20} height={20} />
          <Text className='text-white'>Sign in with Apple</Text>
        </View>
      </Button>
    </SafeAreaView>
  );
}
