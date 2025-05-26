import { Slot, Stack } from 'expo-router';
import { View } from '~/components/ui/view';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
        },
      }}>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='settings' options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
