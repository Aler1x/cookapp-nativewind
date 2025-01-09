import { Tabs, Stack, useSegments  } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { CirclePlus, LibraryBig, ShoppingBasket, CircleUserRound, Search } from '~/assets/icons';
import NavBar from '~/components/nav-bar';
import { View } from '~/components/ui/view';

export default function RootLayout() {
  const segments = useSegments();

  const hideNavBarRoutes = ['achievements', 'settings', 'preferences', 'filters'];
  const hideNavbar = hideNavBarRoutes.some((route) => segments.includes(route));

  return (
    <View className='flex-1'>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen
          name="search"
          options={{
            title: 'Search',
          }}
        />
        <Stack.Screen
          name="library"
          options={{
            title: 'Library',
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            title: 'Create',
          }}
        />
        <Stack.Screen
          name="shopping"
          options={{
            title: 'Shopping',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Stack>

      {!hideNavbar &&  <NavBar />}

    </View>
  );
}
