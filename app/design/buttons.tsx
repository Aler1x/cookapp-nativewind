import React from 'react';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <SafeAreaView>
        <View className='flex-1 items-center justify-center gap-4 p-4'>
          <Text className='text-2xl font-bold'>Buttons</Text>
        </View>
        <View className='flex-1 gap-4 px-10 py-2'>
          <Button>
            <Text>Basic Button</Text>
          </Button>
          <Button variant='outline'>
            <Text>Outline Button</Text>
          </Button>
          <Button variant='ghost'>
            <Text>Ghost Button</Text>
          </Button>
          <Button variant='link'>
            <Text>Link Button</Text>
          </Button>
          <Button variant='destructive'>
            <Text>Destructive Button</Text>
          </Button>
          <Button variant='secondary'>
            <Text>Secondary Button</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
