import { Redirect, Stack } from 'expo-router'
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { useAuth } from '@clerk/clerk-expo';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';

export default function AuthRoutesLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
          },
        }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
