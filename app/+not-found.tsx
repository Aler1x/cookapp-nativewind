import React from 'react';
import { Stack } from 'expo-router';

import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { Link } from '~/components/ui/button-link';

export default function NotFoundScreen() {
  return (
    <>
      <View className='flex-1 items-center justify-center gap-4'>
        <Text className='text-center text-lg font-bold'>This screen doesn't exist.</Text>
        <Link href='/(tabs)/library' className='w-[60vw]'>
          <Text className='text-center text-lg font-bold'>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
