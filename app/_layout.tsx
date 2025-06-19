import { ThemeProvider } from '@react-navigation/native';
import { THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
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
import React, { useEffect, useLayoutEffect } from 'react';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import DesktopBlocker from '~/components/DesktopBlocker';
import BaseLayout from '~/components/pages/base-layout';
import 'expo-dev-client';

// Shim for React Native: override useInsertionEffect to prevent scheduling updates in it
// @ts-ignore
;(React as any).useInsertionEffect = useLayoutEffect;

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    Comfortaa_300Light,
    Comfortaa_400Regular,
    Comfortaa_500Medium,
    Comfortaa_600SemiBold,
    Comfortaa_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <DesktopBlocker>
      <ClerkProvider tokenCache={tokenCache} afterSignOutUrl='https://cookapp.alerix.dev'>
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
