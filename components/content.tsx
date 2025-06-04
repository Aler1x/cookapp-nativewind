import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useColorScheme } from '~/lib/useColorScheme';
import { MoonStar, Sun } from '~/assets/icons';
import { Link } from '~/components/ui/button-link';

export default function Content() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className='flex-1'>
      <View className='py-12 md:py-24 lg:py-32 xl:py-48'>
        <View className='px-4 md:px-6'>
          <View className='flex flex-col items-center gap-4 text-center'>
            <Text
              role='heading'
              className='text-3xl text-center native:text-4xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl'>
              Welcome to Project ACME
            </Text>
            <Text className='mx-auto max-w-[700px] text-lg text-center text-gray-500 md:text-xl dark:text-gray-400'>
              Discover and collaborate on acme. Explore our services now.
            </Text>

            <Button
              className='mt-4 inline-flex flex-row items-center gap-2'
              variant='secondary'
              onPress={toggleColorScheme}>
              <Text>Get Started</Text>
              {colorScheme === 'dark' ? <MoonStar className='text-foreground' /> : <Sun className='text-foreground' />}
            </Button>

            <Link href='/(tabs)/search/results'>
              <Text>Search</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
