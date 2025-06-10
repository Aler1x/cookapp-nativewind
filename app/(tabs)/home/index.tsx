import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { ScrollView } from 'react-native';
import { useFetch } from '~/hooks/useFetch';
import { debounce } from '~/lib/debounce';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { Recipe, RecipesPage } from '~/types/recipe';
import { FiltersRequest } from '~/types/home';
import RecipeCard from '~/components/recipe-card';
import { Button } from '~/components/ui/button';
import { Settings2 } from '~/assets/icons';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import FiltersPage from '~/components/modals/filters';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const [showTitle, setShowTitle] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersRequest>({
    searchQuery: '',
    cookTime: { min: 5, max: 120 },
    difficulty: [],
    dishTypes: [],
    diets: [],
    ingredients: { includeIds: [], excludeIds: [] }
  });

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const $fetch = useFetch();

  const fetchRecipes = useCallback(async () => {
    try {
      const fetchedRecipes = await $fetch<RecipesPage>(`${API_ENDPOINTS_PREFIX.node}/recommendations`);
      setRecipes(fetchedRecipes.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  }, [$fetch]);

  const fetchRecipesGuest = useCallback(async () => {
    try {
      const fetchedRecipes = await $fetch<RecipesPage>(`${API_ENDPOINTS_PREFIX.public}/recipes`);
      setRecipes(fetchedRecipes.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  }, [$fetch]);

  useEffect(() => {
    if (isSignedIn) {
      fetchRecipes();
    } else {
      fetchRecipesGuest();
    }
  }, [isSignedIn, fetchRecipes, fetchRecipesGuest]);

  const getAppliedFiltersCount = () => {
    let count = 0;

    if (filters.cookTime.min > 5 || filters.cookTime.max < 120) {
      count++;
    }

    count += filters.difficulty.length;
    count += filters.dishTypes.length;
    count += filters.diets.length;
    count += filters.ingredients.includeIds.length;
    count += filters.ingredients.excludeIds.length;

    if (filters.searchQuery.trim()) {
      count++;
    }

    return count;
  };

  const handleApplyFilters = (newFilters: FiltersRequest) => {
    setFilters(newFilters);
    // TODO: Implement filtered recipe search based on newFilters
    console.log('Applied filters:', newFilters);
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  return (
    <SafeAreaView className='flex-1 bg-background'>
        <ScrollView className='flex-1 px-4'>
          {showTitle && (
            <View className='mt-4 mb-2 max-w-[220px]'>
              <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
            </View>
          )}

          <View className='flex-1 flex-row flex-wrap justify-between'>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} className='w-[48%] h-48' />
            ))}
          </View>
        </ScrollView>

        <View className='absolute bottom-0 left-0 right-0 items-center'>
          <Button variant='black' className='w-[80%]' onPress={() => setShowFilters(true)}>
            <View className='flex-row items-center gap-2'>
              <Settings2 size={20} color='white' />
              <Text className='text-white font-medium'>
                Filters {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
              </Text>
            </View>
          </Button>
        </View>

        <FullscreenModal visible={showFilters} onClose={() => setShowFilters(false)}>
          <FiltersPage
            onClose={() => setShowFilters(false)}
            filters={filters}
            onApplyFilters={handleApplyFilters}
          />
        </FullscreenModal>
    </SafeAreaView>
  );
}
