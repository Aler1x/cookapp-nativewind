import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { View } from './ui/view';
import { Text } from './ui/text';
import { CirclePlus, LibraryBig, ShoppingBasket, CircleUserRound, Search } from '~/assets/icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isDarkColorScheme } = useColorScheme();

  const redirectIfNotOnRoute = (route: string) => {
    if (pathname !== route && `/(tabs)${pathname}` !== route) {
      router.replace(route);
    }
  };

  return (
    <View className='flex-row justify-around items-center h-16 border-t'>
      <TouchableOpacity
        onPress={() => redirectIfNotOnRoute('/(tabs)/search')}
        className='flex-1 items-center justify-center'>
        <View className='flex-row items-center gap-2'>
          <Search
            size={28}
            color={isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => redirectIfNotOnRoute('/(tabs)/library')}
        className='flex-1 items-center justify-center'>
        <View className='flex-row items-center gap-2'>
          <LibraryBig
            size={28}
            color={isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => redirectIfNotOnRoute('/(tabs)/create')}
        className='flex-1 items-center justify-center'>
        <View className='flex-row items-center gap-2'>
          <CirclePlus
            size={28}
            color={isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => redirectIfNotOnRoute('/(tabs)/shopping')}
        className='flex-1 items-center justify-center'>
        <View className='flex-col items-center gap-2'>
          <ShoppingBasket
            size={28}
            color={isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => redirectIfNotOnRoute('/(tabs)/profile')}
        className='flex-1 items-center justify-center'>
        <View className='flex-row items-center gap-2'>
          <CircleUserRound
            size={28}
            color={isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
