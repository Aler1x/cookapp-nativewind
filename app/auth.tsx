import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import AuthPage from '~/components/pages/auth'

export default function Auth() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <AuthPage />
  )
}


