import React from 'react';
import { Link, Stack } from 'expo-router';

import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex-1 align-center justify-center p-5'>
        <Text className='text-center'>This screen doesn't exist.</Text>
        <Link href="/" className='mt-4 py-4'>
          <Text className='underline'>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
