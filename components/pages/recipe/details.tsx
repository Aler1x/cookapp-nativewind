import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { RecipeFull } from '~/types/recipe';
import { Badge } from '~/components/ui/badge';
import { capitalizeFirstLetter } from '~/lib/utils';

interface RecipeDetailsProps {
  recipe: RecipeFull;
}

const formatNutrition = (value: number, unit: string) => {
  return `${Math.round(value)} ${unit}`;
};

const NutritionItem = ({ value, unit, label }: { value: number; unit: string; label: string }) => {
  return (
    <View className='native:p-4 items-center rounded-lg bg-white web:p-3'>
      <Text className='text-2xl font-bold web:text-lg web:font-semibold'>{formatNutrition(value, unit)}</Text>
      <Text className='text-gray-600 web:text-sm'>{label}</Text>
    </View>
  );
};

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  return (
    <View className='gap-6'>
      {/* Nutritional Information */}
      {recipe.nutrition && (
        <View>
          <View className='flex-row justify-between px-2'>
            <NutritionItem value={recipe.nutrition.calories} unit='k' label='Energy' />
            <NutritionItem value={recipe.nutrition.protein} unit='g' label='Protein' />
            <NutritionItem value={recipe.nutrition.carbohydrate} unit='g' label='Carbs' />
            <NutritionItem value={recipe.nutrition.fat} unit='g' label='Fat' />
          </View>
        </View>
      )}

      {/* Categories */}
      {recipe.categories.length > 0 && (
        <View className='flex-row flex-wrap gap-2'>
          {recipe.categories.map((category) => (
            <Badge key={category.id} label={capitalizeFirstLetter(category.name)} labelClasses='text-sm font-normal' />
          ))}
        </View>
      )}

      {/* Description */}
      {recipe.description && (
        <View>
          <Text className='leading-6 text-gray-700'>{recipe.description}</Text>
        </View>
      )}
    </View>
  );
}
