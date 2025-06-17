import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { THEME } from '~/lib/constants';
import { BotMessageSquare, LibraryBig, ShoppingBasket, CircleUserRound, Search } from '~/assets/icons';

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDarkColorScheme ? THEME.dark.colors.primary : THEME.light.colors.primary,
        tabBarInactiveTintColor: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
          borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
          paddingTop: Platform.select({ ios: 30, web: 20, default: 20 }),
          paddingBottom: Platform.select({ ios: 70, web: 65, default: 80 }),
          paddingLeft: 10,
          paddingRight: 10,
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          position: 'absolute',
        },
        animation: 'shift',
      }}
      initialRouteName='home'>
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Search size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='library'
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <LibraryBig size={28} color={color} />,
          sceneStyle: {
            paddingBottom: 80,
          },
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <BotMessageSquare size={28} color={color} />,
          sceneStyle: {
            paddingBottom: Platform.OS === 'web' ? 80 : 91
          }
        }}
      />
      <Tabs.Screen
        name='shopping'
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) => <ShoppingBasket size={28} color={color} />,
          sceneStyle: {
            paddingBottom: 80,
          },
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <CircleUserRound size={28} color={color} />,
          sceneStyle: {
            paddingBottom: 80,
          },
        }}
      />
    </Tabs>
  );
}
