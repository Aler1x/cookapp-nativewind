import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal } from 'react-native';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SafeAreaView className='flex-1 items-center justify-center'>
      <Button onPress={() => setIsModalOpen(true)}>
        <Text>Open Modal</Text>
      </Button>
      <Modal
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        animationType='slide'
        presentationStyle='pageSheet'>
        <View className='flex-1 items-center justify-center'>
          <View className='w-full h-full bg-white rounded-t-3xl'>
            <Text>Hello</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
