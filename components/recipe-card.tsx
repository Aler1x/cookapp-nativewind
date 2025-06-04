import { View } from '~/components/ui/view';
import { Text } from './ui/text';
import { TouchableOpacity, Image } from 'react-native';
import { cn } from '~/lib/utils';
import { router } from 'expo-router';
import type { Recipe } from '~/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  large?: boolean;
  className?: string;
}

export default function RecipeCard({ recipe, large, className }: RecipeCardProps) {
  const handlePress = () => {
    router.push(`/recipes/${recipe.id}/${recipe.slug}`);
  };

  const cardSize = () => {
    if (large) {
      return 'w-full h-60 max-w-[80vw]';
    }
    return '';
  };

  return (
    <TouchableOpacity onPress={handlePress} className={cn('rounded-3xl overflow-hidden', cardSize(), className)}>
      {recipe.mainImageUrl ? (
        <Image source={{ uri: recipe.mainImageUrl }} className='w-full h-2/3' resizeMode='cover' />
      ) : (
        <View className='w-full h-2/3 bg-gray-200' />
      )}
      <View className='p-3 flex-1 justify-between'>
        <Text className='font-medium text-base' numberOfLines={1}>
          {recipe.title}
        </Text>
        {/* <View className='flex-row justify-between items-center mt-1'>
            <View className='flex-row items-center'>
              <Text className='text-xs mr-1'>★</Text>
              <Text className='text-xs'>{recipe.rating?.toFixed(1)}</Text>
            </View>
            {recipe.durationTotal !== undefined && <Text className='text-xs text-gray-600'>{recipe.durationTotal} min</Text>}
          </View> */}
      </View>
    </TouchableOpacity>
  );
}
