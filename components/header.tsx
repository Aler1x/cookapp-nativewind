import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }}>
      <View className='flex h-14 flex-row items-center justify-between px-4 lg:px-6'>
        <Link className='flex-1 items-center justify-center text-foreground' href='/'>
          <Text>ACME</Text>
        </Link>
        <View className='flex flex-row gap-4 sm:gap-6'>
          <Link className='text-md font-medium hover:underline web:underline-offset-4' href='/'>
            <Text>About</Text>
          </Link>
          <Link className='text-md font-medium hover:underline web:underline-offset-4' href='/'>
            <Text>Product</Text>
          </Link>
          <Link className='text-md font-medium hover:underline web:underline-offset-4' href='/'>
            <Text>Pricing</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
