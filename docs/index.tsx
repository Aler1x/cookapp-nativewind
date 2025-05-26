import React, { useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import PreferencesPage from '~/components/pages/preferences';
import { Preferences } from '~/types/profile';

export default function FullScreenModal() {
  const [showPreferences, setShowPreferences] = useState(false);

  const handleSavePreferences = (preferences: Preferences) => {
    console.log('Preferences saved from modal:', preferences);
    setShowPreferences(false);
  };

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <Text className='text-xl font-bold mb-4'>Full Screen Modal Demo</Text>
      <Text className='text-gray-600 mb-6 text-center px-4'>
        This demonstrates how to use the fullscreen modal with page components
      </Text>

      <Button onPress={() => setShowPreferences(true)} className='bg-black px-6 py-3 rounded-full'>
        <Text className='text-white'>Open Preferences</Text>
      </Button>

      <FullscreenModal visible={showPreferences} onClose={() => setShowPreferences(false)}>
        <PreferencesPage onClose={() => setShowPreferences(false)} onSave={handleSavePreferences} />
      </FullscreenModal>
    </View>
  );
}
