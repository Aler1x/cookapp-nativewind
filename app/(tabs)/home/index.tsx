import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { FlatList } from 'react-native';
import { useFetch } from '~/hooks/useFetch';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { Recipe } from '~/types/recipe';
import { FiltersRequest } from '~/types/home';
import RecipeCard from '~/components/recipe-card';
import { Button } from '~/components/ui/button';
import { Settings2 } from '~/assets/icons';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import FiltersPage from '~/components/modals/filters';
import { PaginatedResponse } from '~/types';
import SearchInput from '~/components/search-input';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const [showTitle, setShowTitle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersRequest>({
    searchQuery: '',
    cookTime: { min: 5, max: 120 },
    difficulty: [],
    dishTypes: [],
    diets: [],
    ingredients: { includeIds: [], excludeIds: [] }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const handleSearchSubmit = useCallback(async () => {
    await performSearch(filters);
  }, [filters]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearchSubmit();
    }
  }, [searchQuery, handleSearchSubmit]);

  const performSearch = useCallback(async (searchFilters: FiltersRequest) => {
    try {
      if (getAppliedFiltersCount() === 0 && !searchFilters.searchQuery) {
        await fetchRecipes();
        return;
      }

      const searchResults = await $fetch<PaginatedResponse<Recipe>>(`${API_ENDPOINTS_PREFIX.node}/recipes/search`, {
        method: 'POST',
        body: JSON.stringify(searchFilters),
      });
      setRecipes(searchResults.data);
    } catch (error) {
      console.error('Error searching recipes:', error);
      setRecipes([]);
    }
  }, []);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const $fetch = useFetch();

  const fetchRecipes = useCallback(async () => {
    try {
      const fetchedRecipes = await $fetch<PaginatedResponse<Recipe>>(`${API_ENDPOINTS_PREFIX.node}/recommendations`);
      setRecipes(fetchedRecipes.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  }, [$fetch]);

  const fetchRecipesGuest = useCallback(async () => {
    try {
      const fetchedRecipes = await $fetch<PaginatedResponse<Recipe>>(`${API_ENDPOINTS_PREFIX.public}/recipes`);
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

    return count;
  };

  const handleApplyFilters = async (newFilters: FiltersRequest) => {
    setFilters(newFilters);
    await performSearch(newFilters);
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='px-4 gap-2 mb-2'>
        {showTitle && (
          <View className='mt-4 max-w-[250px]'>
            <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
          </View>
        )}
        <SearchInput value={searchQuery} onChangeText={handleSearch} onSubmit={handleSearchSubmit} />
      </View>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} className='flex-1 h-48 mx-1' />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 8 }}
        showsVerticalScrollIndicator={false}
      />

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
