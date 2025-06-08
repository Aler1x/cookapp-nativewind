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
  'bg-red-200',
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-purple-200',
  'bg-pink-200',
  'bg-indigo-200',
  'bg-orange-200',
];

export default function LibraryCard({ collection, className }: LibraryCardProps) {
  const offsetAmount = 25; // Horizontal offset in pixels
  const handlePress = () => {
    router.push(`/(tabs)/library/${collection.id}`);
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
        const colorIndex = (collection.id.charCodeAt(0) + i) % fallbackColors.length;
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

  const recipeCount = collection.recipes?.length || 0;

  return (
    <TouchableOpacity onPress={handlePress} className={cn('w-[48%]', className)} activeOpacity={0.7}>
      {/* Image previews section */}
      <View className='h-32 mb-3 relative' style={{ marginRight: offsetAmount * 2 }}>
        {getImagePreviews()}
      </View>

      {/* Collection info */}
      <View className='flex-col space-y-2'>
        <Text className='font-semibold text-lg' numberOfLines={1}>
          {collection.name}
        </Text>
        <Text className='text-muted-foreground text-sm'>
          {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
