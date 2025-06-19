import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import InputWithDropdown, { SelectListData } from '~/components/ui/input-with-dropdown';
import { X, Plus } from 'lucide-react-native';
import { useFetch } from '~/hooks/useFetch';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { SearchProduct } from '~/types';
import { SearchUnit } from '~/types/shopping';
import { cn } from '~/lib/utils';

export interface IngredientData {
  id?: string;
  productId: number;
  productName: string;
  amount: number;
  unitId?: number;
  unitName?: string;
}

interface IngredientInputProps {
  ingredients: IngredientData[];
  onIngredientsChange: (ingredients: IngredientData[]) => void;
  className?: string;
  disabled?: boolean;
}

interface SingleIngredientInputProps {
  ingredient: IngredientData;
  onUpdate: (ingredient: IngredientData) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function SingleIngredientInput({ 
  ingredient, 
  onUpdate, 
  onRemove, 
  disabled 
}: SingleIngredientInputProps) {
  const { isSignedIn } = useAuth();
  const $fetch = useFetch();

  // Fetch products function for SelectList
  const fetchProducts = useCallback(
    async (query: string): Promise<SelectListData[]> => {
      if (!isSignedIn || !query.trim() || query.length < 2) {
        return [];
      }

      try {
        const response = await $fetch<SearchProduct[]>(
          `${API_ENDPOINTS_PREFIX.spring}/products?name=${encodeURIComponent(query)}`
        );

        if (response) {
          return response.slice(0, 5).map((product) => ({
            id: product.id,
            value: product.name,
          }));
        }

        return [];
      } catch (error) {
        console.error('Error searching products:', error);
        return [];
      }
    },
    [$fetch, isSignedIn]
  );

  // Fetch units function for SelectList
  const fetchUnits = useCallback(
    async (query: string): Promise<SelectListData[]> => {
      if (!isSignedIn || !query.trim() || query.length < 2) {
        return [];
      }

      try {
        const response = await $fetch<SearchUnit[]>(
          `${API_ENDPOINTS_PREFIX.spring}/units?name=${encodeURIComponent(query)}`
        );
        if (response) {
          return response.slice(0, 5).map((unit) => ({
            id: unit.id,
            value: unit.name.one,
          }));
        }
        return [];
      } catch (error) {
        console.error('Error searching units:', error);
        return [];
      }
    },
    [$fetch, isSignedIn]
  );

  const handleProductChange = useCallback((value: SelectListData | string) => {
    if (typeof value === 'string') {
      onUpdate({
        ...ingredient,
        productName: value,
        productId: 0, // Use 0 for custom products
      });
    } else {
      onUpdate({
        ...ingredient,
        productName: value.value,
        productId: parseInt(value.id),
      });
    }
  }, [ingredient, onUpdate]);

  const handleUnitChange = useCallback((value: SelectListData | string) => {
    if (typeof value === 'string') {
      onUpdate({
        ...ingredient,
        unitName: value,
        unitId: undefined,
      });
    } else {
      onUpdate({
        ...ingredient,
        unitName: value.value,
        unitId: parseInt(value.id),
      });
    }
  }, [ingredient, onUpdate]);

  const handleAmountChange = useCallback((amount: string) => {
    const numericAmount = parseFloat(amount) || 0;
    onUpdate({
      ...ingredient,
      amount: numericAmount,
    });
  }, [ingredient, onUpdate]);

  return (
    <View className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-medium text-gray-700">Ingredient</Text>
        {!disabled && (
          <TouchableOpacity onPress={onRemove}>
            <X size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      <View className="gap-3">
        {/* Product Name Input with Search */}
        <View className="gap-1">
          <Text className="text-sm font-medium">Name</Text>
          <InputWithDropdown
            setSelected={handleProductChange}
            placeholder="Enter ingredient name"
            fetchItems={fetchProducts}
            search={true}
            value={ingredient.productName}
            searchPlaceholder="Search for ingredients..."
            notFoundText="No ingredients found"
            boxStyles={{
              borderColor: THEME.light.colors.primary,
            }}
            dropdownStyles={{
              borderColor: THEME.light.colors.primary,
            }}
          />
        </View>

        <View className="flex-row gap-3">
          {/* Amount Input */}
          <View className="flex-1 gap-1">
            <Text className="text-sm font-medium">Amount</Text>
            <Input
              className="rounded-lg border border-gray-300"
              placeholder="0"
              value={ingredient.amount > 0 ? ingredient.amount.toString() : ''}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              editable={!disabled}
            />
          </View>

          {/* Unit Input with Search */}
          <View className="flex-1 gap-1">
            <Text className="text-sm font-medium">Unit</Text>
            <InputWithDropdown
              setSelected={handleUnitChange}
              placeholder="cups, lbs, etc."
              fetchItems={fetchUnits}
              search={true}
              searchPlaceholder="Search for units..."
              notFoundText="No units found"
              value={ingredient.unitName}
              boxStyles={{
                borderColor: THEME.light.colors.primary,
              }}
              dropdownStyles={{
                borderColor: THEME.light.colors.primary,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function IngredientInput({
  ingredients,
  onIngredientsChange,
  className,
  disabled = false,
}: IngredientInputProps) {
  const addIngredient = () => {
    const newIngredient: IngredientData = {
      productId: 0,
      productName: '',
      amount: 0,
      unitId: undefined,
      unitName: '',
    };
    onIngredientsChange([...ingredients, newIngredient]);
  };

  const updateIngredient = (index: number, updatedIngredient: IngredientData) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = updatedIngredient;
    onIngredientsChange(newIngredients);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(newIngredients);
  };

  return (
    <View className={cn('', className)}>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold">Ingredients</Text>
        {!disabled && (
          <Button variant="outline" size="sm" onPress={addIngredient}>
            <View className="flex-row items-center gap-2">
              <Plus size={16} color={THEME.light.colors.primary} />
              <Text className="text-primary">Add Ingredient</Text>
            </View>
          </Button>
        )}
      </View>

      {ingredients.length === 0 ? (
        <View className="p-6 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center">
          <Text className="text-gray-500 text-center">No ingredients added yet</Text>
          {!disabled && (
            <Text className="text-gray-400 text-sm mt-1">Tap &quot;Add Ingredient&quot; to get started</Text>
          )}
        </View>
      ) : (
        ingredients.map((ingredient, index) => (
          <SingleIngredientInput
            key={index}
            ingredient={ingredient}
            onUpdate={(updatedIngredient) => updateIngredient(index, updatedIngredient)}
            onRemove={() => removeIngredient(index)}
            disabled={disabled}
          />
        ))
      )}
    </View>
  );
} 