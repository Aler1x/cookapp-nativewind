import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { share } from '~/lib/share';
import Toast from 'react-native-toast-message';

export default function ShoppingListPage() {
  const onShare = async () => {
    const result = await share('text', 'Hello', {
      dialogTitle: 'Sharing shopping list',
    });

    if (result.error) {
      Toast.show({
        type: 'error',
        text1: 'Error sharing shopping list',
        text2: result.error.message,
      });
    }
  };

  return (
    <SafeAreaView className='flex-1 p-4'>
      <Text className='text-2xl' style={{ fontFamily: 'Comfortaa_700Bold' }}>
        Shopping
      </Text>
      <Button onPress={onShare}>
        <Text>Share this list</Text>
      </Button>
    </SafeAreaView>
  );
}
