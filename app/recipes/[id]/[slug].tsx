import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { THEME } from '~/lib/constants';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { isDarkColorScheme } = useColorScheme();
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();

  return (
    <SafeAreaView
      className='flex-1 items-center justify-center'
      style={{
        backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
      }}>
      <Text>Recipe Detail</Text>
      <Text>ID: {id}</Text>
      <Text>Slug: {slug}</Text>
    </SafeAreaView>
  );
}
