import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View className='native:hidden flex shrink-0 bg-gray-200 dark:bg-gray-800' style={{ paddingBottom: bottom }}>
      <View className='items-start px-4 py-6 md:px-6'>
        <Text className='text-center'>© {new Date().getFullYear()} Me</Text>
      </View>
    </View>
  );
}
