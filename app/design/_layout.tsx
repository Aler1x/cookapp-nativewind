import { Stack, Tabs } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { THEME } from '~/lib/constants';

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
        },
      }}
    >
      <Tabs.Screen name='buttons' />
      <Tabs.Screen name='modals' />

    </Tabs>
  );
}
