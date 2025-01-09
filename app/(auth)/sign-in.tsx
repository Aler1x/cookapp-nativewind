import React from 'react'
import { Link, useRouter } from 'expo-router'
import { View } from '~/components/ui/view'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { ScrollView as ScrollViewUI } from '~/components/ui/scroll-view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { Input } from '~/components/ui/input'

export default function SignInScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
      className="flex-1"
    >
      <ScrollViewUI
        className="items-center justify-center gap-4 p-6 flex-1"
      >
        {error && (
          <Text className="text-destructive">{error}</Text>
        )}
        <Input
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          placeholder="Email address"
          onChangeText={setEmailAddress}
          className="w-full"
        />
        <Input
          value={password}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          className="w-full"
        />
        <Button
          onPress={onSignInPress}
          disabled={isLoading}
          className="w-full"
        >
          <Text>{isLoading ? 'Signing in...' : 'Sign in'}</Text>
        </Button>

        <View className="flex-row gap-1">
          <Text className="text-muted-foreground">Don't have an account?</Text>
          <Link href="/sign-up" asChild>
            <Text className="text-primary">Sign up</Text>
          </Link>
        </View>
      </ScrollViewUI>
    </KeyboardAvoidingView>
  )
}
