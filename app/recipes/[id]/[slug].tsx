import React, { useEffect, useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Tabs, TabsProvider, TabsContent } from '~/components/ui/tabs';
import { RecipeDetails } from '~/components/pages/recipe/details';
import { RecipeIngredients } from '~/components/pages/recipe/ingredients';
import { RecipeSteps } from '~/components/pages/recipe/steps';
import { RecipeSkeleton } from '~/components/pages/recipe/skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFetch } from '~/hooks/useFetch';
import { RecipeFull } from '~/types/recipe';
import { BookmarkPlus, ChevronLeft, Star } from '~/assets/icons';
import { Response } from '~/types';
import { capitalizeFirstLetter } from '~/lib/utils';
import { useAuth } from '@clerk/clerk-expo';
import { useShoppingListStore } from '~/stores/shopping';
import BasicModal from '~/components/ui/basic-modal';
import AddRecipeToCollectionModal from '~/components/modals/add-recipe-to-collection';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_HEIGHT = 350;

export default function Page() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();
  const { isSignedIn } = useAuth();
  console.log('id', id, slug);
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);

  const $fetch = useFetch();
  const { addItem } = useShoppingListStore();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const url = isSignedIn
          ? `${API_ENDPOINTS_PREFIX.node}/recipes/${id}`
          : `${API_ENDPOINTS_PREFIX.public}/recipes/${id}`;
        const response = await $fetch<Response<RecipeFull>>(url);
        if (response.success && response.data) {
          setRecipe(response.data);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, $fetch, isSignedIn]);

  const handleIngredientCheck = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleAllStepsCompleted = async () => {
    if (!recipe) return;

    try {
      await $fetch(`${API_ENDPOINTS_PREFIX.node}/interactions`, {
        method: 'POST',
        body: JSON.stringify({
          recipeId: recipe.id,
          interactionType: 'cook',
        }),
      });
    } catch (error) {
      console.error('Failed to send interaction event:', error);
    }
  };

  if (loading) {
    return <RecipeSkeleton />;
  }

  if (!recipe) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center bg-background'>
        <Text>Recipe not found</Text>
        <Button onPress={() => router.back()} className='mt-4'>
          <Text>Go Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <View className='flex-1 bg-background'>
      {/* Fixed Image Header */}
      <View className='absolute left-0 right-0 top-0 z-0' style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={{ uri: recipe.mainImageUrl }}
          style={{ width: screenWidth, height: IMAGE_HEIGHT }}
          className='bg-gray-200'
        />
        {/* Gradient overlay */}
        <View className='absolute inset-0 bg-gradient-to-b from-black/20 to-transparent' />
      </View>

      <SafeAreaView className='absolute left-0 top-0 z-20' style={{ elevation: 10 }}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)/home'))}
          className='m-4 h-10 w-10 items-center justify-center rounded-full bg-black/50'>
          <ChevronLeft size={24} color='white' />
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView className='absolute right-0 top-0 z-20' style={{ elevation: 10 }}>
        <TouchableOpacity
          onPress={() => setIsAddToCollectionModalOpen(true)}
          className='m-4 h-10 w-10 items-center justify-center rounded-full bg-black/50'>
          <BookmarkPlus size={24} color='white' />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Scrollable Content */}
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: IMAGE_HEIGHT - 20, zIndex: 30 }}>
        {/* Content Card */}
        <View className='min-h-screen rounded-t-3xl bg-background shadow-lg'>
          {/* Recipe Header */}
          <View className='px-6 pb-4 pt-8'>
            <Text className='mb-2 text-center text-3xl font-bold'>{recipe.title}</Text>
            <View className='mb-2 flex-row items-center justify-center gap-2'>
              <Text className='text-center text-gray-600'>
                {capitalizeFirstLetter(
                  recipe.categories.find((cat) => cat.type.name === 'cuisine')?.name || 'World Cuisine'
                )}
              </Text>
            </View>

            {/* Recipe Stats */}
            <View className='mb-2 flex-row items-center justify-center gap-6'>
              <Text className='text-gray-600'>{recipe.duration} min</Text>
              <View className='h-1 w-1 rounded-full bg-gray-400' />
              <Text className='text-gray-600'>{capitalizeFirstLetter(recipe.difficulty)}</Text>
              {recipe.rating && (
                <>
                  <View className='h-1 w-1 rounded-full bg-gray-400' />
                  <View className='flex-row items-center gap-1'>
                    <Star size={16} color='#FFA500' fill='#FFA500' />
                    <Text className='text-gray-600'>{recipe.rating?.toFixed(1)}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Tabs */}
            <Tabs
              tabs={[
                { key: 'details', label: 'Details' },
                { key: 'ingredients', label: 'Ingredients' },
                { key: 'steps', label: 'Steps' },
              ]}
              tabIndicator={{
                left: {
                  inputRange: [0, 1, 2],
                  outputRange: ['1%', '34.5%', '68%'],
                },
                width: '33%',
              }}
              defaultTab='details'
              onTabChange={handleTabChange}
              className='mb-2'
            />
          </View>

          {/* Tab Content */}
          <TabsProvider activeTab={activeTab}>
            <TabsContent value='details' className='px-6 pb-8'>
              <RecipeDetails recipe={recipe} />
            </TabsContent>

            <TabsContent value='ingredients' className='px-6 pb-8'>
              <RecipeIngredients
                recipe={recipe}
                checkedIngredients={checkedIngredients}
                onIngredientCheck={handleIngredientCheck}
                onAddToShoppingList={(ingredient) => {
                  addItem({
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                  });
                }}
              />
            </TabsContent>

            <TabsContent value='steps' className='px-6 pb-8'>
              <RecipeSteps
                recipe={recipe}
                completedSteps={completedSteps}
                onStepComplete={handleStepComplete}
                onAllStepsCompleted={handleAllStepsCompleted}
              />
            </TabsContent>
          </TabsProvider>
        </View>
      </ScrollView>

      {isSignedIn && (
        <SafeAreaView edges={['bottom']} className='bg-background'>
          <BasicModal
            isModalOpen={isAddToCollectionModalOpen}
            setIsModalOpen={setIsAddToCollectionModalOpen}
            className='bg-background'>
            <AddRecipeToCollectionModal recipeId={recipe.id} onClose={() => setIsAddToCollectionModalOpen(false)} />
          </BasicModal>
        </SafeAreaView>
      )}
    </View>
  );
}
