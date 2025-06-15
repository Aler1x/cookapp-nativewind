import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { RecipeFull } from '~/types/recipe';
import { Checkbox } from '~/components/ui/checkbox';
import { cn, capitalizeFirstLetter } from '~/lib/utils';
import { Check, ShoppingBasket } from '~/assets/icons';
import { useShoppingListStore } from '~/stores/shopping';

interface RecipeIngredientsProps {
  recipe: RecipeFull;
  checkedIngredients: Set<string>;
  onIngredientCheck: (ingredientId: string) => void;
  onAddToShoppingList?: (ingredient: { name: string; amount: number; unit?: string }) => void;
}

export function RecipeIngredients({
  recipe,
  checkedIngredients,
  onIngredientCheck,
  onAddToShoppingList,
}: RecipeIngredientsProps) {
  const { items: shoppingListItems, normalizeUnit } = useShoppingListStore();

  const isIngredientInList = (ingredientName: string) => {
    return shoppingListItems.some((item) => item.name.toLowerCase() === ingredientName.toLowerCase());
  };

  const formatIngredientAmount = (ingredient: any) => {
    const { measurements } = ingredient;

    if (!measurements || measurements.amount === null) {
      return 'to taste';
    }

    if (measurements.amount && measurements.unit) {
      const unitName =
        measurements.amount === 1
          ? measurements.unit.name?.one || measurements.unit.name
          : measurements.unit.name?.many || measurements.unit.name;
      return `${measurements.amount} ${unitName}`;
    }

    if (measurements.amount) {
      return measurements.amount.toString();
    }

    return 'to taste';
  };

  const getShoppingListData = (ingredient: any) => {
    const { measurements } = ingredient;

    if (!measurements || measurements.amount === null) {
      return { amount: 1, unit: 'pinch' }; // Default for "to taste" items
    }

    const amount = measurements.amount || 1;
    let unit = '';

    if (measurements.unit) {
      unit = normalizeUnit(measurements.unit.name?.one || measurements.unit.name || '');
    }

    return {
      amount,
      unit,
    };
  };

  const handleAddToShoppingList = (ingredient: any) => {
    if (!onAddToShoppingList) return;

    const { amount, unit } = getShoppingListData(ingredient);
    onAddToShoppingList({
      name: ingredient.name,
      amount,
      unit,
    });
  };

  return (
    <View>
      {/* Ingredients Count */}
      <Text className='mb-4 text-xl font-bold'>{recipe.ingredients.length} Items</Text>

      {/* Ingredients List */}
      <View className='gap-4'>
        {recipe.ingredients.map((ingredient, index) => {
          const isInList = isIngredientInList(ingredient.name);
          return (
            <View key={`${ingredient.id}-${index}`} className='flex-row items-center justify-between py-3'>
              <TouchableOpacity
                onPress={() => onIngredientCheck(ingredient.id)}
                className='flex-1 flex-row items-center gap-3'>
                <Checkbox
                  checked={checkedIngredients.has(ingredient.id)}
                  onCheckedChange={() => onIngredientCheck(ingredient.id)}
                  className='border-2'
                />
                <Text
                  className={cn(
                    'flex-1 text-lg',
                    checkedIngredients.has(ingredient.id) && 'text-gray-400 line-through'
                  )}>
                  {capitalizeFirstLetter(ingredient.name)}
                </Text>
              </TouchableOpacity>

              <View className='flex-row items-center gap-3'>
                <Text
                  className={cn(
                    'text-lg font-medium',
                    checkedIngredients.has(ingredient.id) && 'text-gray-400 line-through'
                  )}>
                  {formatIngredientAmount(ingredient)}
                </Text>

                {onAddToShoppingList && (
                  <TouchableOpacity
                    onPress={() => handleAddToShoppingList(ingredient)}
                    disabled={isInList}
                    className={cn(
                      'h-10 w-10 items-center justify-center rounded-full bg-primary/10',
                      isInList && 'bg-green-100'
                    )}>
                    {isInList ? <Check size={22} color='green' /> : <ShoppingBasket size={22} color='#F97316' />}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
