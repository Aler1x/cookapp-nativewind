import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { CirclePlus, LibraryBig, ShoppingBasket, CircleUserRound, Search } from '~/assets/icons';

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
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
          }
        }),
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Search size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <LibraryBig size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <CirclePlus size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: 'Shopping',
          tabBarIcon: ({ color }) => <ShoppingBasket size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <CircleUserRound size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
