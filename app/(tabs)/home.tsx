import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useFetch } from '~/hooks/useFetch';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { Recipe } from '~/types/recipe';
import { FiltersRequest, QuickFiltersResponse } from '~/types/home';
import RecipeCard from '~/components/recipe-card';
import { Button } from '~/components/ui/button';
import { Settings2 } from '~/assets/icons';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import FiltersPage from '~/components/modals/filters';
import { PaginatedResponse, Response } from '~/types';
import SearchInput from '~/components/search-input';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import BasicModal from '~/components/ui/basic-modal';
import AddRecipeToCollectionModal from '~/components/modals/add-recipe-to-collection';
import Toast from 'react-native-toast-message';
import { usePaginated } from '~/hooks/usePaginated';
import HomeSkeleton from '~/components/pages/home/skeleton';

const INITIAL_FILTERS = {
  searchQuery: '',
  cookTime: { min: 5, max: 120 },
  difficulty: [],
  dishTypes: [],
  diets: [],
  cuisines: [],
  ingredients: { includeIds: [], excludeIds: [] },
};

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filters, setFilters] = useState<FiltersRequest>(INITIAL_FILTERS);

  const [ingredients, setIngredients] = useState<
    { id: number; name: string; isSelected: boolean; type: 'include' | 'exclude' }[]
  >([]);

  const [activeBadge, setActiveBadge] = useState<string>('');

  const $fetch = useFetch();

  const appliedFiltersCount = useMemo(() => {
    let count = 0;

    if (filters.cookTime.min > 5 || filters.cookTime.max < 120) {
      count++;
    }

    count += filters.difficulty.length;
    count += filters.dishTypes.length;
    count += filters.diets.length;
    count += filters.cuisines.length;
    count += filters.ingredients.includeIds.length;
    count += filters.ingredients.excludeIds.length;

    return count;
  }, [filters]);

  const fetcher = useCallback(
    async (page: number) => {
      const size = 10;

      if ((filters.searchQuery && filters.searchQuery.length > 0) || appliedFiltersCount > 0) {
        setActiveBadge('');
        const url = `${API_ENDPOINTS_PREFIX.node}/recipes/search?page=${page}&size=${size}`;
        return await $fetch<PaginatedResponse<Recipe>>(url, {
          method: 'POST',
          body: JSON.stringify(filters),
        });
      } else if (activeBadge) {
        const url = `${API_ENDPOINTS_PREFIX.node}/recipes/quick-filters/${activeBadge}?page=${page}&size=${size}`;
        return await $fetch<PaginatedResponse<Recipe>>(url);
      } else {
        const url = isSignedIn
          ? `${API_ENDPOINTS_PREFIX.node}/recommendations?page=${page}&size=${size}&diversityFactor=0.7`
          : `${API_ENDPOINTS_PREFIX.public}/recipes?page=${page}&size=${size}`;
        return await $fetch<PaginatedResponse<Recipe>>(url);
      }
    },
    [$fetch, isSignedIn, activeBadge, appliedFiltersCount, filters]
  );

  const {
    data: recipes,
    currentPage,
    totalPages,
    isLoading,
    isLoadingMore,
    fetchPage,
    refresh,
    loadMore,
  } = usePaginated<Recipe>(fetcher);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleSearchSubmit = useCallback(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleApplyFilters = async (
    newFilters: FiltersRequest,
    ingredientData?: {
      include: { id: number; name: string }[];
      exclude: { id: number; name: string }[];
    }
  ) => {
    // Clear active badge when applying filters
    setActiveBadge('');
    
    // Update filters state
    setFilters(newFilters);

    if (ingredientData) {
      const allIngredients = [
        ...ingredientData.include.map((ing) => ({ ...ing, isSelected: true, type: 'include' as const })),
        ...ingredientData.exclude.map((ing) => ({ ...ing, isSelected: true, type: 'exclude' as const })),
      ];
      setIngredients(allIngredients);
    }

    // The useEffect below will handle fetching when filters change
  };

  const getIngredientsForFilters = () => {
    const include = ingredients.filter((ing) => ing.type === 'include').map((ing) => ({ id: ing.id, name: ing.name }));
    const exclude = ingredients.filter((ing) => ing.type === 'exclude').map((ing) => ({ id: ing.id, name: ing.name }));
    return { include, exclude };
  };

  const [quickFilters, setQuickFilters] = useState<QuickFiltersResponse>();

  const fetchQuickFilters = useCallback(async () => {
    const response = await $fetch<Response<QuickFiltersResponse>>(`${API_ENDPOINTS_PREFIX.node}/recipes/quick-filters`);
    setQuickFilters(response.data);
  }, [$fetch]);

  useEffect(() => {
    if (isSignedIn) {
      fetchQuickFilters();
    }
  }, [fetchQuickFilters, isSignedIn]);

  const handleBadgePress = (badgeId: string) => {
    if (activeBadge === badgeId) {
      setActiveBadge('');
    } else {
      clearFilters();
      setActiveBadge(badgeId);
    }
  };

  // keep a ref to always call the latest fetchPage without re-triggering the effect when
  // fetchPage reference changes on each filters update. This prevents extra network
  // requests on every keystroke when the search query updates.
  const fetchPageRef = React.useRef(fetchPage);

  // update ref whenever the callback instance changes
  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  // fetch when the active quick-filter badge changes or on initial mount
  useEffect(() => {
    fetchPageRef.current(1);
  }, [activeBadge]);

  // fetch when filters are applied
  useEffect(() => {
    if (appliedFiltersCount > 0) {
      fetchPageRef.current(1);
    }
  }, [appliedFiltersCount, filters]);

  // If the user clears the search bar (and no other filters are applied), automatically
  // refresh to show recommendations without requiring an extra submit tap.
  useEffect(() => {
    if (searchQuery === '' && appliedFiltersCount === 0 && activeBadge === '') {
      fetchPageRef.current(1);
    }
  }, [searchQuery, appliedFiltersCount, activeBadge]);

  const handleRecipeLongPress = (recipe: Recipe) => {
    if (!isSignedIn) {
      Toast.show({
        type: 'info',
        text1: 'Sign In Required',
        text2: 'Please sign in to add recipes to collections',
      });
      return;
    }

    setSelectedRecipe(recipe);
    setIsAddToCollectionModalOpen(true);
  };

  const handleAddToCollectionSuccess = () => {
    if (selectedRecipe) {
      Toast.show({
        type: 'success',
        text1: 'Recipe Added!',
        text2: `"${selectedRecipe.title}" has been added to your collection`,
      });
    }
    setIsAddToCollectionModalOpen(false);
    setSelectedRecipe(null);
  };

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View className='items-center py-2'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
        </View>
      );
    }

    if (recipes.length > 0 && currentPage >= totalPages) {
      return (
        <View className='items-center py-2'>
          <Text className='text-muted-foreground'>You&apos;ve reached the end!</Text>
          <Text className='mt-1 text-sm text-muted-foreground'>
            Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </Text>
        </View>
      );
    }

    return null;
  };

  if (isLoading && recipes.length === 0) {
    return <HomeSkeleton />;
  }

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <View className='mb-2 gap-2 px-4'>
        <View className='mt-4 max-w-[250px]'>
          <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
        </View>
        {isSignedIn && (
          <>
            <SearchInput value={searchQuery} onChangeText={handleSearch} onSubmit={handleSearchSubmit} />
            <ScrollView
              horizontal
              className='py-1'
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 4 }}>
              {quickFilters?.filters.map((badge) => (
                <TouchableOpacity key={badge.id} onPress={() => handleBadgePress(badge.id)}>
                  <Badge
                    label={badge.name}
                    variant='outline'
                    className={cn(
                      'px-4 py-2',
                      activeBadge === badge.id ? 'border-primary bg-primary' : 'border-black bg-background'
                    )}
                    labelClasses={cn('text-sm font-medium')}
                    style={{
                      elevation: 3,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} className='mx-1 h-52 flex-1' onLongPress={handleRecipeLongPress} />
        )}
        keyExtractor={(item: Recipe, index: number) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={refresh}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={{ paddingBottom: 120 }}
      />

      {isSignedIn && (
        <View className='absolute bottom-0 left-0 right-0 items-center pb-32 web:pb-24'>
          <Button
            variant='black'
            className='w-[60%]'
            onPress={() => setShowFilters(true)}
            style={{
              elevation: 10,
            }}>
            <View className='flex-row items-center gap-2'>
              <Settings2 size={20} color='white' />
              <Text className='font-medium text-white'>
                Filters {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
              </Text>
            </View>
          </Button>
        </View>
      )}

      <FullscreenModal visible={showFilters} onClose={() => setShowFilters(false)}>
        <FiltersPage
          onClose={() => setShowFilters(false)}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          initialIngredients={getIngredientsForFilters()}
        />
      </FullscreenModal>

      {selectedRecipe && (
        <BasicModal
          isModalOpen={isAddToCollectionModalOpen}
          setIsModalOpen={(open) => {
            setIsAddToCollectionModalOpen(open);
            if (!open) setSelectedRecipe(null);
          }}>
          <AddRecipeToCollectionModal
            recipeId={selectedRecipe.id}
            recipeName={selectedRecipe.title}
            onSuccess={handleAddToCollectionSuccess}
            onClose={() => {
              setIsAddToCollectionModalOpen(false);
              setSelectedRecipe(null);
            }}
          />
        </BasicModal>
      )}
    </SafeAreaView>
  );
}
