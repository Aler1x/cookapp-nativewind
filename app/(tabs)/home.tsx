import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useFetch } from '~/hooks/useFetch';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { Recipe } from '~/types/recipe';
import { FiltersRequest, BadgeFilters, BADGES } from '~/types/home';
import RecipeCard from '~/components/recipe-card';
import { Button } from '~/components/ui/button';
import { Settings2 } from '~/assets/icons';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import FiltersPage from '~/components/modals/filters';
import { PaginatedResponse } from '~/types';
import SearchInput from '~/components/search-input';
import { throttle } from 'lodash';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';
import BasicModal from '~/components/ui/basic-modal';
import AddRecipeToCollectionModal from '~/components/modals/add-recipe-to-collection';
import Toast from 'react-native-toast-message';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const [showTitle, setShowTitle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filters, setFilters] = useState<FiltersRequest>({
    searchQuery: '',
    cookTime: { min: 5, max: 120 },
    difficulty: [],
    dishTypes: [],
    diets: [],
    ingredients: { includeIds: [], excludeIds: [] },
  });

  const [badges, setBadges] = useState<BadgeFilters[]>(BADGES);
  const [activeBadge, setActiveBadge] = useState<number | null>(null);

  // Pagination state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const $fetch = useFetch();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      cookTime: { min: 5, max: 120 },
      difficulty: [],
      dishTypes: [],
      diets: [],
      ingredients: { includeIds: [], excludeIds: [] },
    });
  };

  const fetchRecipes = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (!append) setIsLoading(true);
        else setIsLoadingMore(true);

        const url = isSignedIn
          ? `${API_ENDPOINTS_PREFIX.node}/recommendations?page=${page}&size=10`
          : `${API_ENDPOINTS_PREFIX.public}/recipes?page=${page}&size=10`;

        const response = await $fetch<PaginatedResponse<Recipe>>(url);

        if (append) {
          setRecipes((prev) => [...prev, ...response.data]);
        } else {
          setRecipes(response.data);
        }

        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (!append) setRecipes([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [$fetch, isSignedIn]
  );

  const appliedFiltersCount = useMemo(() => {
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
  }, [filters]);

  const performSearch = useCallback(
    throttle(async (searchFilters: FiltersRequest, page: number = 1, append: boolean = false) => {
      try {
        if (!append) setIsLoading(true);
        else setIsLoadingMore(true);

        if (appliedFiltersCount === 0 && !searchFilters.searchQuery) {
          await fetchRecipes(page, append);
          return;
        }

        const response = await $fetch<PaginatedResponse<Recipe>>(
          `${API_ENDPOINTS_PREFIX.node}/recipes/search?page=${page}&size=10`,
          {
            method: 'POST',
            body: JSON.stringify(searchFilters),
          }
        );

        if (append) {
          setRecipes((prev) => [...prev, ...response.data]);
        } else {
          setRecipes(response.data);
        }

        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error searching recipes:', error);
        if (!append) setRecipes([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }, 500),
    [$fetch, fetchRecipes, appliedFiltersCount]
  );

  const handleSearchSubmit = useCallback(async () => {
    setCurrentPage(1);
    await performSearch(filters, 1, false);
  }, [filters, performSearch]);

  const loadMoreRecipes = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    const nextPage = currentPage + 1;
    await performSearch(filters, nextPage, true);
  }, [currentPage, totalPages, isLoadingMore, filters, performSearch]);

  useEffect(() => {
    setCurrentPage(1);
    handleSearchSubmit();
  }, [searchQuery, handleSearchSubmit]);

  useEffect(() => {
    fetchRecipes();
  }, [isSignedIn, fetchRecipes]);

  const handleApplyFilters = async (newFilters: FiltersRequest) => {
    setFilters(newFilters);
    setCurrentPage(1);
    await performSearch(newFilters, 1, false);
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
    return (
      <SafeAreaView className='flex-1 bg-background'>
        <View className='mb-2 gap-2 px-4'>
          {showTitle && (
            <View className='mt-4 max-w-[250px]'>
              <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
            </View>
          )}
          <SearchInput value={searchQuery} onChangeText={handleSearch} onSubmit={handleSearchSubmit} />
        </View>

        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
          <Text className='mt-4 text-muted-foreground'>Loading recipes...</Text>
        </View>

        <View className='absolute bottom-0 left-0 right-0 items-center'>
          <Button variant='black' className='w-[80%]' onPress={() => setShowFilters(true)}>
            <View className='flex-row items-center gap-2'>
              <Settings2 size={20} color='white' />
              <Text className='font-medium text-white'>
                Filters {appliedFiltersCount > 0 && `(${appliedFiltersCount})`}
              </Text>
            </View>
          </Button>
        </View>

        <FullscreenModal visible={showFilters} onClose={() => setShowFilters(false)}>
          <FiltersPage onClose={() => setShowFilters(false)} filters={filters} onApplyFilters={handleApplyFilters} />
        </FullscreenModal>
      </SafeAreaView>
    );
  }

  const handleBadgePress = (badgeId: number) => {
    if (activeBadge === badgeId) {
      setActiveBadge(null);
      setBadges((prev) => prev.map((badge) => ({ ...badge, isActive: false })));
      clearFilters();
      return;
    }

    setActiveBadge(badgeId);
    setBadges((prev) => prev.map((badge) => ({ ...badge, isActive: badge.id === badgeId })));
    clearFilters();
    setFilters((prev) => ({
      ...prev,
      ...BADGES.find((badge) => badge.id === badgeId)?.settings,
    }));
  };

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

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
      <View className='mb-2 gap-2 px-4'>
        {showTitle && (
          <View className='mt-4 max-w-[250px]'>
            <Text className='text-2xl font-bold'>What do you want to cook today?</Text>
          </View>
        )}
        {isSignedIn && (
          <>
            <SearchInput value={searchQuery} onChangeText={handleSearch} onSubmit={handleSearchSubmit} />
            <ScrollView
              horizontal
              className='py-1'
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 4 }}>
              {badges.map((badge) => (
                <TouchableOpacity key={badge.id} onPress={() => handleBadgePress(badge.id)}>
                  <Badge
                    label={badge.name}
                    variant='outline'
                    className={cn(
                      'px-4 py-2',
                      badge.isActive ? 'border-primary bg-primary' : 'border-black bg-background'
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
          <RecipeCard 
            recipe={item} 
            className='mx-1 h-52 flex-1' 
            onLongPress={handleRecipeLongPress}
          />
        )}
        keyExtractor={(item: Recipe, index: number) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreRecipes}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={() => {
          setCurrentPage(1);
          performSearch(filters, 1, false);
        }}
        ListFooterComponent={renderFooter}
        ListFooterComponentStyle={{ paddingBottom: 120 }}
      />

      {isSignedIn && (
        <View className='absolute bottom-0 left-0 right-0 items-center pb-32'>
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
        <FiltersPage onClose={() => setShowFilters(false)} filters={filters} onApplyFilters={handleApplyFilters} />
      </FullscreenModal>

      {/* Add to Collection Modal */}
      {selectedRecipe && (
        <BasicModal 
          isModalOpen={isAddToCollectionModalOpen} 
          setIsModalOpen={(open) => {
            setIsAddToCollectionModalOpen(open);
            if (!open) setSelectedRecipe(null);
          }}
        >
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
