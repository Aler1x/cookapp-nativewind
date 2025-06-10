import { Stack } from 'expo-router';
import { View } from '~/components/ui/view';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='results' />
    </Stack>
  );
}
