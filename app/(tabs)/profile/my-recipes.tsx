import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingButton } from '~/components/ui/floating-button';
import { Plus, List, X } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { useFetch } from '~/hooks/useFetch';
import { Recipe } from '~/types/recipe';
import { PaginatedResponse } from '~/types';
import RecipeCard from '~/components/recipe-card';
import { Text } from '~/components/ui/text';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import BasicModal from '~/components/ui/basic-modal';
import Toast from 'react-native-toast-message';
import AddRecipeSelection from '~/components/modals/add-recipe-selection';
import SocialMediaRecipeInput from '~/components/modals/social-media-recipe-input';
import { FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Job } from '~/types/profile';
import { Button } from '~/components/ui/button';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import JobCard from '~/components/job-card';

type ModalStep = 'selection' | 'social-media-input';

export default function Page() {
  // Recipe state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesCurrentPage, setRecipesCurrentPage] = useState(1);
  const [recipesTotalPages, setRecipesTotalPages] = useState(1);
  const [recipesIsLoading, setRecipesIsLoading] = useState(false);
  const [recipesIsLoadingMore, setRecipesIsLoadingMore] = useState(false);

  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsCurrentPage, setJobsCurrentPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [jobsIsLoading, setJobsIsLoading] = useState(false);
  const [jobsIsLoadingMore, setJobsIsLoadingMore] = useState(false);

  // Modal state
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('selection');
  const [socialMediaUrl, setSocialMediaUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState(false);

  const $fetch = useFetch();

  // Fetch recipes with pagination
  const fetchRecipes = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (!append) setRecipesIsLoading(true);
        else setRecipesIsLoadingMore(true);

        const response = await $fetch<PaginatedResponse<Recipe>>(
          `${API_ENDPOINTS_PREFIX.spring}/recipes/my?page=${page}&size=10`
        );

        if (append) {
          setRecipes((prev) => [...prev, ...response.data]);
        } else {
          setRecipes(response.data);
        }

        setRecipesCurrentPage(response.meta.page);
        setRecipesTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (!append) setRecipes([]);
      } finally {
        setRecipesIsLoading(false);
        setRecipesIsLoadingMore(false);
      }
    },
    [$fetch]
  );

  // Fetch jobs with pagination
  const fetchJobs = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        if (!append) setJobsIsLoading(true);
        else setJobsIsLoadingMore(true);

        const response = await $fetch<PaginatedResponse<Job>>(
          `${API_ENDPOINTS_PREFIX.node}/jobs?page=${page}&size=10`
        );

        if (append) {
          setJobs((prev) => [...prev, ...response.data]);
        } else {
          setJobs(response.data);
        }

        setJobsCurrentPage(response.meta.page);
        setJobsTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        if (!append) setJobs([]);
      } finally {
        setJobsIsLoading(false);
        setJobsIsLoadingMore(false);
      }
    },
    [$fetch]
  );

  // Load more recipes
  const loadMoreRecipes = useCallback(async () => {
    if (recipesIsLoadingMore || recipesCurrentPage >= recipesTotalPages) return;

    const nextPage = recipesCurrentPage + 1;
    await fetchRecipes(nextPage, true);
  }, [recipesCurrentPage, recipesTotalPages, recipesIsLoadingMore, fetchRecipes]);

  // Load more jobs
  const loadMoreJobs = useCallback(async () => {
    if (jobsIsLoadingMore || jobsCurrentPage >= jobsTotalPages) return;

    const nextPage = jobsCurrentPage + 1;
    await fetchJobs(nextPage, true);
  }, [jobsCurrentPage, jobsTotalPages, jobsIsLoadingMore, fetchJobs]);

  // Initial data fetch
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Fetch jobs when modal opens
  useEffect(() => {
    if (showJobsModal) {
      fetchJobs();
    }
  }, [showJobsModal, fetchJobs]);

  const handleModalClose = () => {
    setShowAddRecipeModal(false);
    setModalStep('selection');
    setSocialMediaUrl('');
    setIsProcessing(false);
  };

  const handleSocialMediaSubmit = async () => {
    if (!socialMediaUrl.trim()) return;

    setIsProcessing(true);

    try {
      const response = await $fetch(`${API_ENDPOINTS_PREFIX.node}/recipe-sources/video-url`, {
        method: 'POST',
        body: JSON.stringify({
          url: socialMediaUrl.trim(),
        }),
      });

      if (response) {
        handleModalClose();
        Toast.show({
          type: 'success',
          text1: 'Recipe Processing Started',
        });
        // Refresh recipes list
        fetchRecipes();
      }
    } catch (error) {
      console.error('Error submitting social media URL:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFromScratch = () => {
    console.log('Create from scratch selected');
  };

  const renderModalContent = () => {
    switch (modalStep) {
      case 'selection':
        return (
          <AddRecipeSelection
            onClose={handleModalClose}
            onSelectSocialMedia={() => setModalStep('social-media-input')}
            onSelectFromScratch={handleFromScratch}
          />
        );

      case 'social-media-input':
        return (
          <SocialMediaRecipeInput
            onClose={handleModalClose}
            onBack={() => setModalStep('selection')}
            socialMediaUrl={socialMediaUrl}
            onChangeUrl={setSocialMediaUrl}
            onSubmit={handleSocialMediaSubmit}
            isProcessing={isProcessing}
          />
        );
    }
  };

  // Render footer for recipes list
  const renderRecipesFooter = () => {
    if (recipesIsLoadingMore) {
      return (
        <View className='py-2 items-center'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
        </View>
      );
    }

    if (recipes.length > 0 && recipesCurrentPage >= recipesTotalPages) {
      return (
        <View className='py-2 items-center'>
          <Text className='text-muted-foreground'>You&apos;ve reached the end!</Text>
          <Text className='text-sm text-muted-foreground mt-1'>
            Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </Text>
        </View>
      );
    }

    return null;
  };

  // Render footer for jobs list
  const renderJobsFooter = () => {
    if (jobsIsLoadingMore) {
      return (
        <View className='py-2 items-center'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
        </View>
      );
    }
    return null;
  };

  // Show loading state for recipes
  if (recipesIsLoading && recipes.length === 0) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center' style={{ padding: 16 }} edges={['top']}>
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
          <Text className='text-muted-foreground mt-4'>Loading recipes...</Text>
        </View>

        <View className='absolute bottom-0 left-0 right-0 items-center pb-8'>
          <Button
            variant='black'
            className='w-[60%]'
            onPress={() => setShowAddRecipeModal(true)}
            style={{ elevation: 10 }}>
            <View className='flex-row items-center gap-2'>
              <Plus size={24} color='white' />
              <Text className='text-white font-medium'>Create Recipe</Text>
            </View>
          </Button>
        </View>

        <FloatingButton onPress={() => setShowJobsModal(true)}>
          <List size={24} color='#000' />
        </FloatingButton>

        <FullscreenModal visible={showJobsModal} onClose={() => setShowJobsModal(false)}>
          <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
            <View className='px-4 py-4 border-b border-gray-200'>
              <Text className='text-xl font-bold'>Processing Jobs</Text>
            </View>
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size='large' color={THEME.light.colors.primary} />
              <Text className='text-muted-foreground mt-4'>Loading jobs...</Text>
            </View>
          </SafeAreaView>
        </FullscreenModal>

        <BasicModal isModalOpen={showAddRecipeModal} setIsModalOpen={setShowAddRecipeModal} className='gap-4'>
          {renderModalContent()}
        </BasicModal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 items-center justify-center' style={{ padding: 16 }} edges={['top']}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => <RecipeCard recipe={item} className='flex-1 h-52 mx-1' />}
        keyExtractor={(item: Recipe, index: number) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreRecipes}
        onEndReachedThreshold={0.5}
        refreshing={recipesIsLoading}
        onRefresh={() => {
          setRecipesCurrentPage(1);
          fetchRecipes(1, false);
        }}
        ListFooterComponent={renderRecipesFooter}
        ListFooterComponentStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View className='flex-1 items-center justify-center'>
            <Text className='text-center font-medium'>No recipes found</Text>
          </View>
        }
      />

      <View className='absolute bottom-0 left-0 right-0 items-center pb-8'>
        <Button
          variant='black'
          className='w-[60%]'
          onPress={() => setShowAddRecipeModal(true)}
          style={{ elevation: 10 }}>
          <View className='flex-row items-center gap-2'>
            <Plus size={24} color='white' />
            <Text className='text-white font-medium'>Create Recipe</Text>
          </View>
        </Button>
      </View>

      <FloatingButton onPress={() => setShowJobsModal(true)}>
        <List size={24} color='#000' />
      </FloatingButton>

      <FullscreenModal visible={showJobsModal} onClose={() => setShowJobsModal(false)}>
        <SafeAreaView className='flex-1 bg-background' edges={['top', 'bottom']}>
          {/* Header */}
          <View className='flex-row items-center justify-between px-6 py-6 border-b border-gray-200'>
            <Text className='text-xl font-bold'>Processing Jobs</Text>
            <TouchableOpacity onPress={() => setShowJobsModal(false)}>
              <X size={24} color='#000' />
            </TouchableOpacity>
          </View>

          {jobsIsLoading && jobs.length === 0 ? (
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size='large' color={THEME.light.colors.primary} />
              <Text className='text-muted-foreground mt-4'>Loading jobs...</Text>
            </View>
          ) : (
            <FlatList
              data={jobs}
              renderItem={({ item }) => <JobCard job={item} />}
              keyExtractor={(item: Job, index: number) => `${item.jobId}-${index}`}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreJobs}
              onEndReachedThreshold={0.5}
              refreshing={jobsIsLoading}
              onRefresh={() => {
                setJobsCurrentPage(1);
                fetchJobs(1, false);
              }}
              ListFooterComponent={renderJobsFooter}
              ListEmptyComponent={
                <View className='flex-1 items-center justify-center py-20'>
                  <Text className='text-center font-medium'>No jobs found</Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </FullscreenModal>

      <BasicModal isModalOpen={showAddRecipeModal} setIsModalOpen={setShowAddRecipeModal} className='gap-4'>
        {renderModalContent()}
      </BasicModal>
    </SafeAreaView>
  );
}
