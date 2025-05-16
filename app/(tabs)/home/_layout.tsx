import { Stack, useNavigation, useFocusEffect  } from 'expo-router';
import { View } from '~/components/ui/view';
import { useCallback } from 'react';

export default function Layout() {
  const navigation = useNavigation();


  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      layout={({ children }) => <View className='flex-1 bg-background'>{children}</View>}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="results" />
      <Stack.Screen name="filters" />
    </Stack>
  );
}
