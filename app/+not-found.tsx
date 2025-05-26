import React from 'react';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { Link } from '~/components/ui/button-link';

export default function NotFoundScreen() {
  return (
    <>
      <View className='flex-1 items-center justify-center gap-4'>
        <Text className='text-center text-lg' style={{ fontFamily: 'Comfortaa_700Bold' }}>
          This screen doesn&apos;t exist.
        </Text>
        <Link href='/(tabs)/home' className='w-[60vw]'>
          <Text className='text-center text-lg' style={{ fontFamily: 'Comfortaa_700Bold' }}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
