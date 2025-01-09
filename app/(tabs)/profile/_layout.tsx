import { Slot, Stack } from 'expo-router';
import { View } from '~/components/ui/view';

export default function Layout() {
  return (
    <Stack 
      layout={({ children }) => <View className='flex-1 bg-background'>{children}</View>}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal', // Optional: Makes it slide up like a modal
          headerShown: true, // Show header for this page
        }}
      />
      <Stack.Screen
        name="achievements"
        options={{
          presentation: 'modal', // Optional: Makes it slide up like a modal
          headerShown: true, // Show header for this page
        }}
      />
      <Stack.Screen name="preferences"
        options={{
          presentation: 'modal', // Optional: Makes it slide up like a modal
          headerShown: true, // Show header for this page
        }}
      />
    </Stack>
  );
}

