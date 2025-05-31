import { Stack } from 'expo-router';
import { View } from '~/components/ui/view';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      layout={({ children }) => <View className='flex-1 bg-background'>{children}</View>}>
      <Stack.Screen name='index' />
      <Stack.Screen name='results' />
      <Stack.Screen name='filters' options={{ presentation: 'modal' }} />
    </Stack>
  );
}
