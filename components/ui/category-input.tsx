import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import InputWithDropdown, { SelectListData } from '~/components/ui/input-with-dropdown';
import { X, Tag } from 'lucide-react-native';
import { useFetch } from '~/hooks/useFetch';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { CategorySearch } from '~/types/recipe';
import { cn } from '~/lib/utils';

interface CategoryInputProps {
  selectedCategories: CategorySearch[];
  onCategoriesChange: (categories: CategorySearch[]) => void;
  className?: string;
  disabled?: boolean;
}

export default function CategoryInput({
  selectedCategories,
  onCategoriesChange,
  className,
  disabled = false,
}: CategoryInputProps) {
  const { isSignedIn } = useAuth();
  const $fetch = useFetch();

  // Fetch categories function for SelectList
  const fetchCategories = useCallback(
    async (query: string): Promise<SelectListData[]> => {
      if (!isSignedIn || !query.trim() || query.length < 2) {
        return [];
      }

      try {
        const response = await $fetch<{ data: CategorySearch[] }>(
          `${API_ENDPOINTS_PREFIX.node}/categories/search`,
          {
            method: 'POST',
            body: JSON.stringify({
              query,
            }),
          }
        );

        if (response) {
          // Filter out already selected categories
          return response.data.slice(0, 10).map((category) => ({
            id: category.id,
            value: category.name,
          }));
        }

        return [];
      } catch (error) {
        console.error('Error searching categories:', error);
        return [];
      }
    },
    [$fetch, isSignedIn]
  );

  const handleCategorySelection = useCallback((value: SelectListData) => {
    if (selectedCategories.some(category => category.id === value.id)) {
      return;
    }

    const newCategory: CategorySearch = {
      id: value.id,
      name: value.value as string,
    };
    onCategoriesChange([...selectedCategories, newCategory]);
  }, [selectedCategories, onCategoriesChange]);

  const removeCategory = (categoryId: string) => {
    const updatedCategories = selectedCategories.filter(
      (category) => category.id !== categoryId
    );
    onCategoriesChange(updatedCategories);
  };

  return (
    <View className={cn('', className)}>
      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <View className="mb-4">
          <View className="flex-row gap-2 flex-wrap">
            {selectedCategories.map((category) => (
              <View
                key={category.id}
                className="flex-row items-center bg-primary/10 rounded-full px-3 py-2 border border-primary/20"
              >
                <Tag size={14} color={THEME.light.colors.primary} />
                <Text className="text-primary ml-2 text-sm font-medium">
                  {category.name}
                </Text>
                {!disabled && (
                  <TouchableOpacity
                    onPress={() => removeCategory(category.id)}
                    className="ml-2"
                  >
                    <X size={14} color={THEME.light.colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Empty State */}
      {selectedCategories.length === 0 && (
        <View className="p-6 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center">
          <Tag size={48} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-2">No categories selected</Text>
          {!disabled && (
            <Text className="text-gray-400 text-sm mt-1">
              Add categories to help people find your recipe
            </Text>
          )}
        </View>
      )}

      {/* Category Search Input */}
      {!disabled && (
        <View className="py-4">
          <Text className="text-sm font-medium mb-2">Search for a category</Text>
          <InputWithDropdown
            setSelected={handleCategorySelection}
            placeholder="Search categories..."
            fetchItems={fetchCategories}
            search={true}
            closeOnSelect={false}
            searchPlaceholder="Type to search categories..."
            notFoundText="No categories found"
            boxStyles={{
              borderColor: THEME.light.colors.primary,
            }}
            dropdownStyles={{
              borderColor: THEME.light.colors.primary,
            }}
          />
        </View>
      )}
    </View>
  );
} 