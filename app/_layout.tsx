import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NAV_THEME } from '~/lib/constants';
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
            <ThemeProvider value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: isDarkColorScheme
                      ? NAV_THEME.dark.colors.background
                      : NAV_THEME.light.colors.background,
                  },
                  keyboardHandlingEnabled: true,
                }}>
                <Stack.Screen name='(tabs)' />
                <Stack.Screen name='index' />
                <Stack.Screen name='+not-found' />
                <Stack.Screen
                  name='stack-modal'
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
              </Stack>

              <PortalHost />

              <Toast topOffset={50} config={toaster} />
            </ThemeProvider>
          </SafeAreaProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </DesktopBlocker>
  );
}
