import React from 'react';
import { TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';

interface AddRecipeSelectionProps {
  onClose: () => void;
  onSelectSocialMedia: () => void;
  onSelectFromScratch: () => void;
}

export default function AddRecipeSelection({
  onClose,
  onSelectSocialMedia,
  onSelectFromScratch
}: AddRecipeSelectionProps) {
  return (
    <>
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-semibold'>Add new recipe</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <View className='gap-2 w-full mb-6'>
        <Button
          onPress={onSelectSocialMedia}
        >
          <Text>Create from social media</Text>
        </Button>

        <Button
          onPress={onSelectFromScratch}
        >
          <Text>Create from scratch</Text>
        </Button>
      </View>
    </>
  );
} 