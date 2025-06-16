import { ActivityIndicator, View } from 'react-native';
import { Text } from '~/components/ui/text';
import React from 'react';
import { Button } from '~/components/ui/button';
import SearchInput from '~/components/search-input';
import { Settings2 } from 'lucide-react-native';
import { Skeleton } from '~/components/ui/skeleton';
import { useAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '~/lib/constants';

export default function HomeSkeleton() {
  const { isSignedIn } = useAuth();

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='mb-2 gap-2 px-4'>
        <View className='mt-4 max-w-[250px]'>
          <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
        </View>
        {isSignedIn && <SearchInput value={''} onChangeText={() => { }} onSubmit={() => { }} />}
      </View>

      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color={THEME.light.colors.primary} />
        <Text className='mt-4 text-muted-foreground'>Loading recipes...</Text>
      </View>

      {isSignedIn && (
        <View className='absolute bottom-0 left-0 right-0 items-center pb-32'>
          <Button
            variant='black'
            className='w-[60%]'
            onPress={() => { }}
            style={{
              elevation: 10,
            }}>
            <View className='flex-row items-center gap-2'>
              <Settings2 size={20} color='white' />
              <Text className='font-medium text-white'>Filters</Text>
            </View>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
