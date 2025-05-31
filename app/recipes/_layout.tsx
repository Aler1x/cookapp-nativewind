import { Stack } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { THEME } from '~/lib/constants';

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
        },
      }}
    />
  );
}
