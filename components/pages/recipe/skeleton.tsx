import React from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '~/components/ui/skeleton';
import { ChevronLeft } from '~/assets/icons';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_HEIGHT = 350;

export function RecipeSkeleton() {
  return (
    <View className='flex-1 bg-background'>
      {/* Fixed Image Header Skeleton */}
      <View className='absolute left-0 right-0 top-0 z-0' style={{ height: IMAGE_HEIGHT }}>
        <Skeleton width={screenWidth} height={IMAGE_HEIGHT} className='bg-gray-200' />
        {/* Gradient overlay */}
        <View className='absolute inset-0 bg-gradient-to-b from-black/20 to-transparent' />
      </View>

      <SafeAreaView className='absolute left-0 top-0 z-30'>
        <View className='m-4 h-10 w-10 items-center justify-center rounded-full bg-black/50'>
          <ChevronLeft size={24} color='white' />
        </View>
      </SafeAreaView>

      {/* Scrollable Content Skeleton */}
      <View className='flex-1' style={{ paddingTop: IMAGE_HEIGHT - 20 }}>
        {/* Content Card */}
        <View className='min-h-screen rounded-t-3xl bg-background shadow-lg'>
          {/* Recipe Header Skeleton */}
          <View className='px-6 pb-4 pt-8'>
            {/* Title */}
            <Skeleton width='80%' height={32} className='mx-auto mb-2' />
            {/* Cuisine */}
            <Skeleton width='60%' height={16} className='mx-auto mb-6' />

            {/* Recipe Stats */}
            <View className='mb-6 flex-row items-center justify-center gap-6'>
              <Skeleton width={60} height={16} />
              <View className='h-1 w-1 rounded-full bg-gray-400' />
              <Skeleton width={50} height={16} />
              <View className='h-1 w-1 rounded-full bg-gray-400' />
              <Skeleton width={40} height={16} />
            </View>

            {/* Tab Navigation Skeleton */}
            <View className='relative mb-6 rounded-full bg-gray-100 p-1'>
              <View className='relative z-10 flex-row items-center justify-between'>
                <View className='flex-1 rounded-full py-3'>
                  <Skeleton width={60} height={16} className='mx-auto' />
                </View>
                <View className='flex-1 rounded-full py-3'>
                  <Skeleton width={80} height={16} className='mx-auto' />
                </View>
                <View className='flex-1 rounded-full py-3'>
                  <Skeleton width={50} height={16} className='mx-auto' />
                </View>
              </View>
            </View>
          </View>

          {/* Tab Content Skeleton */}
          <View className='px-6 pb-8'>
            {/* Nutritional Information Skeleton */}
            <View className='mb-6'>
              <View className='mb-4 flex-row justify-between'>
                <View className='items-center'>
                  <Skeleton width={40} height={24} className='mb-1' />
                  <Skeleton width={50} height={14} />
                </View>
                <View className='items-center'>
                  <Skeleton width={35} height={24} className='mb-1' />
                  <Skeleton width={45} height={14} />
                </View>
                <View className='items-center'>
                  <Skeleton width={40} height={24} className='mb-1' />
                  <Skeleton width={40} height={14} />
                </View>
                <View className='items-center'>
                  <Skeleton width={30} height={24} className='mb-1' />
                  <Skeleton width={30} height={14} />
                </View>
              </View>
            </View>

            {/* Description Skeleton */}
            <View className='space-y-2'>
              <Skeleton width='100%' height={16} />
              <Skeleton width='95%' height={16} />
              <Skeleton width='90%' height={16} />
              <Skeleton width='85%' height={16} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
