import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { router } from 'expo-router';
import { cn } from '~/lib/utils';
import type { CollectionPage } from '~/types/library';

interface LibraryCardProps {
  collection: CollectionPage;
  className?: string;
}

const fallbackColors = [
  'bg-[#ADD6CF]',
  'bg-[#92B693]',
  'bg-[#F8E8C4]',
  'bg-[#F0AF9E]',
  'bg-[#E48364]',
];

export default function LibraryCard({ collection, className }: LibraryCardProps) {
  const offsetAmount = 25; // Horizontal offset in pixels
  const handlePress = () => {
    router.push({
      pathname: `/(tabs)/library/${collection.id}`,
      params: { name: collection.name }
    });
  };

  const getImagePreviews = () => {
    const images = collection.recipes || [];
    const previews = [];

    // Create 3 stacked preview cards
    for (let i = 0; i < 3; i++) {
      const zIndex = 3 - i; // Higher z-index for cards that should be on top
      const leftOffset = i * offsetAmount;

      if (i < images.length && images[i]) {
        // Show actual image
        previews.push(
          <View
            key={i}
            className='absolute w-full h-full rounded-xl overflow-hidden'
            style={{
              left: leftOffset,
              zIndex: zIndex,
            }}>
            <Image source={{ uri: images[i] }} className='w-full h-full' resizeMode='cover' />
          </View>
        );
      } else {
        // Show fallback color
        const colorIndex = (collection.id + i) % fallbackColors.length;
        previews.push(
          <View
            key={i}
            className={cn('absolute w-full h-full rounded-xl', fallbackColors[colorIndex])}
            style={{
              left: leftOffset,
              zIndex: zIndex,
            }}
          />
        );
      }
    }

    return previews;
  };

  const recipeCount = collection.recipeCount || 0;

  return (
    <TouchableOpacity onPress={handlePress} className={cn('w-[48%]', className)} activeOpacity={0.7}>
      {/* Image previews section */}
      <View className='h-32 mb-3 relative' style={{ marginRight: offsetAmount * 2 }}>
        {getImagePreviews()}
      </View>

      {/* Collection info */}
      <View className='flex-row items-center justify-between'>
        <Text className='font-semibold text-lg' numberOfLines={1}>
          {collection.name}
        </Text>
        <Text className='text-muted-foreground text-sm font-medium'>
          {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
