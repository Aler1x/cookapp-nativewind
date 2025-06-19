import { Text } from '~/components/ui/text';
import { TouchableOpacity, Image, View } from 'react-native';
import { cn } from '~/lib/utils';
import { router } from 'expo-router';
import type { Recipe } from '~/types/recipe';
import { ClockIcon, ImageIcon, StarIcon, Utensils } from 'lucide-react-native';
import React from 'react';
import { Separator } from './ui/separator';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onLongPress?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, className, onLongPress }: RecipeCardProps) {
  const handlePress = () => {
    router.push(`/recipes/${recipe.id}/${recipe.slug}`);
  };

  const handleLongPress = () => {
    onLongPress?.(recipe);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress ? handleLongPress : undefined}
      className={cn('flex-1 overflow-hidden rounded-3xl border border-black bg-background', className)}
      style={{
        elevation: 10,
      }}>
      {recipe.mainImageUrl ? (
        <Image source={{ uri: recipe.mainImageUrl }} className='h-[60%] w-full' resizeMode='cover' />
      ) : (
        <View className='h-[60%] w-full items-center justify-center bg-gray-200'>
          <ImageIcon size={48} color='black' />
        </View>
      )}
      <View className='flex-1 justify-between rounded-b-3xl border-t border-black p-[0.4rem]'>
        <Text className='text-base font-normal' numberOfLines={2}>
          {recipe.title}
        </Text>
        <View className='flex-row items-center justify-between px-2'>
          <View className='flex-row items-center gap-1'>
            <StarIcon size={12} color='#FFB923' style={{ marginBottom: 1 }} fill='#FFB923' />
            <Text className='text-xs'>{recipe.rating?.toFixed(1) || '-'}</Text>
          </View>

          <Separator orientation='vertical' className='h-4 bg-black' />

          {recipe.duration && (
            <View className='flex-row items-center justify-center gap-1'>
              <ClockIcon size={12} color='black' style={{ marginBottom: 1 }} />
              <Text className='text-xs'>{recipe.duration} min</Text>
            </View>
          )}

          <Separator orientation='vertical' className='h-4 bg-black' />

          {recipe.servings && (
            <View className='flex-row items-center justify-center gap-1'>
              <Utensils size={12} color='black' style={{ marginBottom: 1 }} />
              <Text className='text-xs'>{recipe.servings}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
