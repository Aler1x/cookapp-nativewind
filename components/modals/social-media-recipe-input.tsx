import React from 'react';
import { TouchableOpacity } from 'react-native';
import { X, ArrowLeft } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

interface SocialMediaRecipeInputProps {
  onClose: () => void;
  onBack: () => void;
  socialMediaUrl: string;
  onChangeUrl: (url: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export default function SocialMediaRecipeInput({
  onClose,
  onBack,
  socialMediaUrl,
  onChangeUrl,
  onSubmit,
  isProcessing,
}: SocialMediaRecipeInputProps) {
  return (
    <>
      <View className='flex-row items-center justify-between'>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeft size={24} color='#000' />
        </TouchableOpacity>
        <Text className='text-lg font-semibold'>Social Media Recipe</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <View className='mb-6 gap-4'>
        <Text className='text-sm text-gray-600'>Paste a link from Instagram, TikTok, YouTube</Text>

        <Input
          placeholder='Paste recipe URL here...'
          value={socialMediaUrl}
          onChangeText={onChangeUrl}
          autoFocus
          autoCapitalize='none'
          keyboardType='url'
        />

        <Button className='w-full' onPress={onSubmit} disabled={!socialMediaUrl.trim() || isProcessing}>
          <Text>{isProcessing ? 'Processing...' : 'Send to Processing'}</Text>
        </Button>
      </View>
    </>
  );
}
