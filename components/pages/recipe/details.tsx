import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
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
    <View className='items-center rounded-lg bg-white p-3'>
      <Text className='text-2xl font-bold web:text-lg web:font-semibold'>{formatNutrition(value, unit)}</Text>
      <Text className='text-gray-600 web:text-sm'>{label}</Text>
    </View>
  );
};

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategoriesCount = 10;
  
  const displayCategories = showAllCategories 
    ? recipe.categories 
    : recipe.categories.slice(0, visibleCategoriesCount);
  const hasMoreCategories = recipe.categories.length > visibleCategoriesCount;

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
        <View>
          <View className='flex-row flex-wrap gap-2'>
            {displayCategories.map((category) => (
              <Badge key={category.id} label={capitalizeFirstLetter(category.name)} labelClasses='text-sm font-normal' />
            ))}
          </View>
          {hasMoreCategories && (
            <TouchableOpacity onPress={() => setShowAllCategories(!showAllCategories)} className='mt-2'>
              <Text className='text-sm text-gray-500'>
                {showAllCategories ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}
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
