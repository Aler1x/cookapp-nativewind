import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Comfortaa_300Light,
  Comfortaa_400Regular,
  Comfortaa_500Medium,
  Comfortaa_600SemiBold,
  Comfortaa_700Bold,
} from '@expo-google-fonts/comfortaa';
import '~/app/global.css';
import { useEffect } from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import Toast from 'react-native-toast-message';
import { toaster } from '~/components/toaster';
import DesktopBlocker from '~/components/DesktopBlocker';
import { useKeepAwake } from 'expo-keep-awake';
import { usePushNotifications } from '~/hooks/usePushNotifications';
import BaseLayout from '~/components/pages/base-layout';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // useKeepAwake();

  const { isDarkColorScheme } = useColorScheme();

  // Initialize push notifications
  // usePushNotifications();

  const [loaded, error] = useFonts({
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      console.log('fonts loaded');
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <DesktopBlocker>
      <ClerkProvider tokenCache={tokenCache} afterSignOutUrl='/'>
        <ClerkLoaded>
          <SafeAreaProvider>
            <ThemeProvider value={isDarkColorScheme ? THEME.dark : THEME.light}>
              <BaseLayout />              
            </ThemeProvider>
          </SafeAreaProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </DesktopBlocker>
  );
}
