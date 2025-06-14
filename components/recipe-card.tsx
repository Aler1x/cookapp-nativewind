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
}

export default function RecipeCard({ recipe, className }: RecipeCardProps) {
  const handlePress = () => {
    router.push(`/recipes/${recipe.id}/${recipe.slug}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={cn('rounded-3xl overflow-hidden border border-black flex-1 bg-background', className)}
      style={{
        elevation: 10,
      }}>
      {recipe.mainImageUrl ? (
        <Image source={{ uri: recipe.mainImageUrl }} className='w-full h-[60%]' resizeMode='cover' />
      ) : (
        <View className='w-full h-[60%] bg-gray-200 items-center justify-center'>
          <ImageIcon size={48} color='black' />
        </View>
      )}
      <View className='p-[0.4rem] flex-1 justify-between border-t border-black rounded-b-3xl'>
        <Text className='font-normal text-base' numberOfLines={2}>
          {recipe.title}
        </Text>
        <View className='flex-row justify-between items-center px-2'>
          <View className='flex-row items-center gap-1'>
            <StarIcon size={12} color='#FFB923' style={{ marginBottom: 1 }} fill='#FFB923' />
            <Text className='text-xs'>{recipe.rating?.toFixed(1)}</Text>
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
