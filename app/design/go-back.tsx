import React from 'react'
import { Text } from '~/components/ui/text'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Button } from '~/components/ui/button'

const GoBack = () => {
  return (
    <SafeAreaView className='flex-1 items-center justify-center gap-4 p-4'>
      <Link href='/(tabs)/home' asChild>
        <Button variant='outline'>
          <Text>Go Back</Text>
        </Button>
      </Link>
    </SafeAreaView>
  )
}

export default GoBack