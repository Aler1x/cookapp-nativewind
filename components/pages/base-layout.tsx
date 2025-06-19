import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { usePushNotifications } from '~/hooks/usePushNotifications';
import { toaster } from '~/components/toaster';

export default function BaseLayout() {
  const { isDarkColorScheme } = useColorScheme();

  // FIX: With expo go this is not working
  // usePushNotifications();

  return (
    <>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
          },
        }}
        initialRouteName='(tabs)'
        >
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='+not-found' />
        <Stack.Screen
          name='stack-modal'
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>

      <Toast config={toaster} topOffset={50} />
    </>
  );
}
