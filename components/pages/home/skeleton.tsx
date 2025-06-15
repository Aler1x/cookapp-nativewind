import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import React from 'react'
import { Button } from '~/components/ui/button'
import SearchInput from '~/components/search-input'
import { Settings2 } from 'lucide-react-native'
import { Skeleton } from '~/components/ui/skeleton'
import { useAuth } from '@clerk/clerk-expo'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeSkeleton() {

  const { isSignedIn } = useAuth();

  return (
    <SafeAreaView className='flex-1 bg-background'>

      <View className='mb-2 gap-2 px-4'>
        <View className='mt-4 max-w-[250px]'>
          <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
        </View>
        {isSignedIn && (
          <SearchInput value={''} onChangeText={() => { }} onSubmit={() => { }} />
        )}
      </View>

      <View className='px-4 pt-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={Math.floor(index / 2)} className='mb-3 flex-row justify-between'>
            {[0, 1].map((colIndex) => {
              const itemIndex = Math.floor(index / 2) * 2 + colIndex;
              if (itemIndex >= 6) return null;
              return (
                <View key={itemIndex} className='mx-1 h-52 flex-1 overflow-hidden rounded-3xl border border-black bg-background' style={{ elevation: 10 }}>
                  <Skeleton height={125} className='w-full rounded-none' />
                  <View className='flex-1 justify-between rounded-b-3xl border-t border-black p-[0.4rem]'>
                    <View className='gap-1'>
                      <Skeleton height={16} className='w-full rounded' />
                      <Skeleton height={16} className='w-3/4 rounded' />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )).filter((_, index) => index < 3)}
      </View>

      {isSignedIn && (
        <View className='absolute bottom-0 left-0 right-0 items-center pb-32'>
          <Button
            variant='black'
            className='w-[60%]'
            onPress={() => {}}
            style={{
              elevation: 10,
            }}>
            <View className='flex-row items-center gap-2'>
              <Settings2 size={20} color='white' />
              <Text className='font-medium text-white'>
                Filters 
              </Text>
            </View>
          </Button>
        </View>
      )}
    </SafeAreaView>
  )
}
