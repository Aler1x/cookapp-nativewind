import { View, TouchableOpacity } from 'react-native'
import { Text } from '~/components/ui/text';
import { Button } from '../ui/button';
import { ArrowLeft, X } from 'lucide-react-native';
import React from 'react'
import ImageUpload from '~/components/ui/image-upload';

interface ImageRecipeInputProps {
  onClose: () => void;
  onBack: () => void;
  imageUrl: string;
  onChangeUrl: (url: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}
const ImageRecipeInput = ({ onClose, onBack, imageUrl, onChangeUrl, onSubmit, isProcessing }: ImageRecipeInputProps) => {
  return (
    <>
    <View className='flex-row items-center justify-between'>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft size={24} color='#000' />
      </TouchableOpacity>
      <Text className='text-lg font-semibold'>Image Recipe</Text>
      <TouchableOpacity onPress={onClose}>
        <X size={24} color='#000' />
      </TouchableOpacity>
    </View>

    <View className='mb-6 gap-4'>
      <Text className='text-sm text-gray-600'>Upload an image of your recipe</Text>

      <ImageUpload
        onImageSelected={onChangeUrl}
        existingImageUrl={imageUrl}
        placeholder='Add photo'
      />

      <Button className='w-full' onPress={onSubmit} disabled={!imageUrl.trim() || isProcessing}>
        <Text>{isProcessing ? 'Processing...' : 'Send to Processing'}</Text>
      </Button>
    </View>
  </>
    
  )
}

export default ImageRecipeInput;