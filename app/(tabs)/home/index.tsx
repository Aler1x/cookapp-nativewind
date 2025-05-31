import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { ScrollView } from 'react-native';

export default function HomePage() {
  return (
    <SafeAreaView className='flex-1 bg-background'>
      <ScrollView className='flex-1 px-4'>
        <View className='mt-4 mb-2 max-w-[220px]'>
          <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
        </View>

        <View className='flex-1'></View>
      </ScrollView>
    </SafeAreaView>
  );
}
