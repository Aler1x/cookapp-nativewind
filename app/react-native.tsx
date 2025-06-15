import { Button, Platform } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
import { Image } from '~/components/ui/image';
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { useBottomTabOverflow } from '~/components/TabBarBackground';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
const HEADER_HEIGHT = 250;

export default function HomeScreen() {
  const bottom = useBottomTabOverflow();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const { isDarkColorScheme } = useColorScheme();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ] as const,
    };
  });

  return (
    <View className='flex-1'>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            headerAnimatedStyle,
            {
              height: HEADER_HEIGHT,
              overflow: 'hidden',
              backgroundColor: isDarkColorScheme ? '#1D3D47' : '#A1CEDC',
            },
          ]}>
          <Image
            source={require('~/assets/images/partial-react-logo.png')}
            className='absolute bottom-0 left-0 h-[178px] w-[290px]'
            contentFit='contain'
          />
        </Animated.View>

        <View className='flex-1 gap-4 overflow-hidden p-8'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-3xl leading-8'>Welcome!</Text>
            <Animated.View className='animate-wave'>
              <Text className='-mt-[6px] text-2xl'>👋</Text>
            </Animated.View>
          </View>
          <View className='mb-0 gap-2'>
            <Text className='text-lg font-semibold leading-8'>Step 1: Try it</Text>
            <Text>
              Edit <Text className='font-semibold leading-6'>app/(tabs)/index.tsx</Text> to see changes. Press{' '}
              <Text className='font-semibold leading-6'>
                {Platform.select({
                  ios: 'cmd + d',
                  android: 'cmd + m',
                  web: 'F12',
                })}
              </Text>{' '}
              to open developer tools.
            </Text>
          </View>
          <View className='mb-0 gap-2'>
            <Text className='text-lg font-semibold leading-8'>Step 2: Explore</Text>
            <Text>Tap the Explore tab to learn more about what&apos;s included in this starter app.</Text>
          </View>
          <View className='mb-0 gap-2'>
            <Text className='text-lg font-semibold leading-8'>Step 3: Get a fresh start</Text>
            <Text>
              When you&apos;re ready, run <Text className='font-semibold'>npm run reset-project</Text> to get a fresh{' '}
              <Text className='font-semibold'>app</Text> directory. This will move the current{' '}
              <Text className='font-semibold'>app</Text> to <Text className='font-semibold'>app-example</Text>.
            </Text>
          </View>
        </View>
        <View className='p-4'>
          <Button title='Go home' onPress={() => router.push('/')} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}
