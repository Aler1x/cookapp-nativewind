import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';

export default function Page() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SafeAreaView
      className='flex-1 items-center justify-center'
      style={{
        backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
      }}>
      <Text>Recipe Detail</Text>
    </SafeAreaView>
  );
}
