import React from 'react'
import { View } from '~/components/ui/view'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { Input } from '~/components/ui/input'
import { useRouter, Link } from 'expo-router'

export default function SignUpScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignUpPress = async () => {
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 p-6 web:max-w-[60vw]">
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
        onPress={onSignUpPress}
        disabled={isLoading}
        className="w-full"
      >
        <Text>{isLoading ? 'Creating account...' : 'Create account'}</Text>
      </Button>

      <View className="flex-row gap-1">
        <Text className="text-muted-foreground">Already have an account?</Text>
        <Link href="/sign-in" asChild>
          <Text className="text-primary">Sign in</Text>
        </Link>
      </View>
    </View>
  )
}
