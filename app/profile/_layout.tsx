import { Stack } from 'expo-router';
import { View } from '~/components/ui/view';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  return (

    <Stack
      screenOptions={{
        animation: 'simple_push',
        animationDuration: 100,
        autoHideHomeIndicator: true,
        contentStyle: {
          backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
        },
      }}
    >
      <Stack.Screen name="achievements" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="settings" />
    </Stack>
  )
}