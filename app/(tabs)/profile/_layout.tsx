import { router, Stack } from 'expo-router';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft, Croissant } from '~/assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header(props) {
          return (
            <SafeAreaView>
              <View className='flex-row items-center justify-between bg-background px-4 py-2'>
                <TouchableOpacity
                  onPress={() => router.push('(tabs)/profile')}
                  className='h-10 w-10 flex-row items-center gap-2'>
                  <ChevronLeft size={24} color='#000' />
                </TouchableOpacity>
                <Text className='text-lg font-semibold'>{props.options.title}</Text>
                <Croissant size={24} color='#000' />
              </View>
            </SafeAreaView>
          );
        },
      }}>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='settings' options={{ title: 'Settings' }} />
      <Stack.Screen name='my-recipes' options={{ title: 'My Recipes' }} />
    </Stack>
  );
}
