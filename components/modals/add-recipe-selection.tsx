import React from 'react';
import { TouchableOpacity } from 'react-native';
import { X, Link, PenTool, ImageIcon } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';

interface AddRecipeSelectionProps {
  onClose: () => void;
  onSelectSocialMedia: () => void;
  onSelectFromScratch: () => void;
  onSelectImage: () => void;
}

export default function AddRecipeSelection({
  onClose,
  onSelectSocialMedia,
  onSelectFromScratch,
  onSelectImage,
}: AddRecipeSelectionProps) {
  return (
    <>
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-lg font-semibold'>Add New Recipe</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color='#000' />
        </TouchableOpacity>
      </View>

      <View className='gap-4'>
        <Text className='text-sm text-gray-600 text-center mb-2'>
          How would you like to add your recipe?
        </Text>

        <TouchableOpacity
          onPress={onSelectFromScratch}
          className='w-full border border-gray-300 rounded-xl p-4'
        >
          <View className='flex-row items-center'>
            <View className='w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4'>
              <PenTool size={24} color='#6B7280' />
            </View>
            <View className='flex-1'>
              <Text className='font-semibold text-lg'>Create from Scratch</Text>
              <Text className='text-gray-600 text-sm'>
                Build your recipe step by step with ingredients, instructions, and photos
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSelectSocialMedia}
          className='w-full border border-primary rounded-xl p-4'
        >
          <View className='flex-row items-center'>
            <View className='w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4'>
              <Link size={24} color='#F97316' />
            </View>
            <View className='flex-1'>
              <Text className='font-semibold text-lg'>From Social Media</Text>
              <Text className='text-gray-600 text-sm'>
                Import from Instagram, TikTok, or YouTube links
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSelectImage}
          className='w-full border border-gray-300 rounded-xl p-4'
        >
          <View className='flex-row items-center'>
            <View className='w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4'>
              <ImageIcon size={24} color='#6B7280' />
            </View>
            <View className='flex-1'>
              <Text className='font-semibold text-lg'>From Image</Text>
              <Text className='text-gray-600 text-sm'>
                Upload an image of your recipe
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
