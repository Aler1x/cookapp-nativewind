import { Slot, Stack } from 'expo-router';
import { View } from '~/components/ui/view';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}

