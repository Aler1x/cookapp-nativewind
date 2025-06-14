import React, { useState } from 'react';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import BasicModal from '~/components/ui/basic-modal';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import { Link } from 'expo-router';

export default function Modals() {
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  return (
    <SafeAreaView>
      <View className='flex-1 items-center justify-center gap-4 p-4'>
        <Text className='text-2xl font-bold'>Modals</Text>
      </View>
      <View className='flex-1 items-center justify-center gap-4 p-4'>
        <Button onPress={() => setIsBasicModalOpen(true)}>
          <Text>Open Basic Modal</Text>
        </Button>
        <Button onPress={() => setIsFullscreenModalOpen(true)}>
          <Text>Open Fullscreen Modal</Text>
        </Button>
      </View>

      <BasicModal isModalOpen={isBasicModalOpen} setIsModalOpen={setIsBasicModalOpen}>
        <Text>Basic Modal</Text>
        <Button onPress={() => setIsBasicModalOpen(false)}>
          <Text>Close Modal</Text>
        </Button>
      </BasicModal>
      <FullscreenModal visible={isFullscreenModalOpen} onClose={() => setIsFullscreenModalOpen(false)}>
        <Text>Fullscreen Modal</Text>
        <Button onPress={() => setIsFullscreenModalOpen(false)}>
          <Text>Close Modal</Text>
        </Button>
      </FullscreenModal>
    </SafeAreaView>
  );
}
