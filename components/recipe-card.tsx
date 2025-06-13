import { Text } from '~/components/ui/text';
import { TouchableOpacity, Image, View } from 'react-native';
import { cn } from '~/lib/utils';
import { router } from 'expo-router';
import type { Recipe } from '~/types/recipe';
import { ImageIcon } from 'lucide-react-native';
import React from 'react';

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
        <View className='w-full h-2/3 bg-gray-200 items-center justify-center'>
          <ImageIcon size={48} color='black' />
        </View>
      )}
      <View className='p-[0.4rem] flex-1 justify-between border-t border-black rounded-b-3xl'>
        <Text className='font-normal text-base' numberOfLines={2}>
          {recipe.title}
        </Text>
        <View className='flex-row justify-between items-center px-2'>
          <View className='flex-row items-center'>
            <Text className='text-xs mr-1'>★</Text>
            <Text className='text-xs'>{recipe.rating?.toFixed(1)}</Text>
          </View>
          {recipe.duration !== undefined && <Text className='text-xs text-gray-600'>{recipe.duration} min</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}
