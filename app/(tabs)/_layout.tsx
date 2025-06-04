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
        tabBarActiveTintColor: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
            borderTopWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            paddingTop: 30,
            paddingBottom: 70,
            paddingLeft: 10,
            paddingRight: 10,
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
          web: {
            backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
            paddingTop: 30,
            paddingBottom: 65,
            paddingLeft: 10,
            paddingRight: 10,
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
          default: {
            backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
            borderTopWidth: 1,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            paddingTop: 20,
            paddingBottom: 80,
            paddingLeft: 10,
            paddingRight: 10,
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          },
        }),
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
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <BotMessageSquare size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='shopping'
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) => <ShoppingBasket size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <CircleUserRound size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
