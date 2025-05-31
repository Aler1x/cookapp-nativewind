import { View } from '~/components/ui/view';
import { Text } from './ui/text';
import { TouchableOpacity, Image } from 'react-native';
import { cn } from '~/lib/utils';
import { router } from 'expo-router';
import type { Recipe } from '~/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  size: 'small' | 'medium' | 'large';
}

export default function RecipeCard({ recipe, size }: RecipeCardProps) {
  const cardSize = () => {
    switch (size) {
      case 'small':
        return 'w-32 h-32';
      case 'medium':
        return 'w-48 h-56';
      case 'large':
        return 'w-full h-60 max-w-[80vw]';
      default:
        return 'w-40 h-48';
    }
  };

  const handlePress = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} className='m-2'>
      <View className={cn('rounded-3xl overflow-hidden', cardSize())}>
        {recipe.mainImageUrl ? (
          <Image source={{ uri: recipe.mainImageUrl }} className='w-full h-2/3' resizeMode='cover' />
        ) : (
          <View className='w-full h-2/3 bg-gray-200' />
        )}
        <View className='p-3 flex-1 justify-between'>
          <Text className='font-medium text-base' numberOfLines={1}>
            {recipe.title}
          </Text>
          <View className='flex-row justify-between items-center mt-1'>
            <View className='flex-row items-center'>
              <Text className='text-xs mr-1'>★</Text>
              <Text className='text-xs'>{recipe.rating.toFixed(1)}</Text>
            </View>
            {recipe.duration !== undefined && <Text className='text-xs text-gray-600'>{recipe.duration} min</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
