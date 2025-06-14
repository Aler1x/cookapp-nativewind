import React, { useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFetch } from '~/hooks/useFetch';
import { RecipeFull } from '~/types/recipe';
import { ChevronLeft, Star, Minus, Plus } from '~/assets/icons';
import { cn } from '~/lib/utils';
import { Response } from '~/types';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

type TabType = 'details' | 'ingredients';

export default function Page() {
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('ingredients');
  const [servings, setServings] = useState(5);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  const $fetch = useFetch();

  React.useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await $fetch<Response<RecipeFull>>(`${API_ENDPOINTS_PREFIX.node}/recipes/${id}`);
        if (response.success && response.data) {
          setRecipe(response.data);
          setServings(response.data.servings);
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
  }, [id, $fetch]);

  const handleIngredientCheck = (ingredientId: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(ingredientId)) {
      newChecked.delete(ingredientId);
    } else {
      newChecked.add(ingredientId);
    }
    setCheckedIngredients(newChecked);
  };

  const adjustServings = (increment: boolean) => {
    setServings(prev => Math.max(1, increment ? prev + 1 : prev - 1));
  };

  const getDifficultyText = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const formatNutrition = (value: number, unit: string) => {
    return `${Math.round(value)} ${unit}`;
  };

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-background items-center justify-center'>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView className='flex-1 bg-background items-center justify-center'>
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
      <View className='absolute top-0 left-0 right-0 z-0' style={{ height: IMAGE_HEIGHT }}>
        <Image
          source={{ uri: recipe.mainImageUrl }}
          style={{ width: screenWidth, height: IMAGE_HEIGHT }}
          className='bg-gray-200'
        />
        {/* Gradient overlay */}
        <View className='absolute inset-0 bg-gradient-to-b from-black/20 to-transparent' />
        <SafeAreaView className='absolute top-0 left-0 z-20'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='m-4 w-10 h-10 bg-black/50 rounded-full items-center justify-center'>
            <ChevronLeft size={24} color='white' />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: IMAGE_HEIGHT - 20, zIndex: 30 }}>

        {/* Content Card */}
        <View className='bg-background rounded-t-3xl min-h-screen shadow-lg'>
          {/* Recipe Header */}
          <View className='px-6 pt-8 pb-4'>
            <Text className='text-3xl font-bold text-center mb-2'>{recipe.title}</Text>
            <Text className='text-gray-600 text-center mb-6'>
              {recipe.categories.find(cat => cat.type.name === 'Cuisine')?.name || 'World Cuisine'}
            </Text>

            {/* Recipe Stats */}
            <View className='flex-row items-center justify-center gap-6 mb-6'>
              <Text className='text-gray-600'>{recipe.duration} min</Text>
              <View className='w-1 h-1 bg-gray-400 rounded-full' />
              <Text className='text-gray-600'>{getDifficultyText(recipe.difficulty)}</Text>
              <View className='w-1 h-1 bg-gray-400 rounded-full' />
              {recipe.rating && <View className='flex-row items-center gap-1'>
                <Star size={16} color='#FFA500' fill='#FFA500' />
                <Text className='text-gray-600'>
                  {recipe.rating?.toFixed(1)}
                </Text>
              </View>}
            </View>

            {/* Tab Navigation */}
            <View className='flex-row bg-gray-100 rounded-full p-1 mb-6'>
              <TouchableOpacity
                onPress={() => setActiveTab('details')}
                className={cn(
                  'flex-1 py-3 rounded-full',
                  activeTab === 'details' ? 'bg-primary' : 'bg-transparent'
                )}>
                <Text className={cn(
                  'text-center font-medium',
                  activeTab === 'details' ? 'text-white' : 'text-gray-600'
                )}>
                  Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('ingredients')}
                className={cn(
                  'flex-1 py-3 rounded-full',
                  activeTab === 'ingredients' ? 'bg-primary' : 'bg-transparent'
                )}>
                <Text className={cn(
                  'text-center font-medium',
                  activeTab === 'ingredients' ? 'text-white' : 'text-gray-600'
                )}>
                  Ingredients
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Content */}
          <View className='px-6 pb-8'>
            {activeTab === 'details' ? (
              <View>
                {/* Nutritional Information */}
                {recipe.nutrition && (
                  <View className='mb-6'>
                    <View className='flex-row justify-between mb-4'>
                      <View className='items-center'>
                        <Text className='text-2xl font-bold'>{formatNutrition(recipe.nutrition.calories, 'k')}</Text>
                        <Text className='text-gray-600'>Energy</Text>
                      </View>
                      <View className='items-center'>
                        <Text className='text-2xl font-bold'>{formatNutrition(recipe.nutrition.protein, 'g')}</Text>
                        <Text className='text-gray-600'>Protein</Text>
                      </View>
                      <View className='items-center'>
                        <Text className='text-2xl font-bold'>{formatNutrition(recipe.nutrition.carbohydrate, 'g')}</Text>
                        <Text className='text-gray-600'>Carbs</Text>
                      </View>
                      <View className='items-center'>
                        <Text className='text-2xl font-bold'>{formatNutrition(recipe.nutrition.fat, 'g')}</Text>
                        <Text className='text-gray-600'>Fat</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Description */}
                {recipe.description && (
                  <View>
                    <Text className='text-gray-700 leading-6'>
                      {recipe.description}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {/* Servings Control */}
                {/* <View className='flex-row items-center justify-between mb-6'>
                  <Text className='text-gray-600'>How many servings?</Text>
                  <View className='flex-row items-center gap-4'>
                    <TouchableOpacity
                      onPress={() => adjustServings(false)}
                      className='w-12 h-12 bg-black rounded-full items-center justify-center'>
                      <Minus size={20} color='white' />
                    </TouchableOpacity>
                    <Text className='text-xl font-medium min-w-[30px] text-center'>{servings}</Text>
                    <TouchableOpacity
                      onPress={() => adjustServings(true)}
                      className='w-12 h-12 bg-black rounded-full items-center justify-center'>
                      <Plus size={20} color='white' />
                    </TouchableOpacity>
                  </View>
                </View> */}

                {/* Ingredients Count */}
                <Text className='text-xl font-bold mb-4'>{recipe.ingredients.length} Items</Text>

                {/* Ingredients List */}
                {/* <View className='space-y-4'>
                  {recipe.ingredients.map((ingredient) => {
                    const ratio = servings / recipe.servings;
                    const adjustedAmount = Math.round(ingredient.measurements.amount * ratio * 10) / 10;
                    const unit = adjustedAmount === 1 
                      ? ingredient.measurements.unit.name.one 
                      : ingredient.measurements.unit.name.many;
                    
                    return (
                      <TouchableOpacity
                        key={ingredient.id}
                        onPress={() => handleIngredientCheck(ingredient.id)}
                        className='flex-row items-center justify-between py-3'>
                        <View className='flex-row items-center flex-1 gap-3'>
                          <Checkbox
                            checked={checkedIngredients.has(ingredient.id)}
                            onCheckedChange={() => handleIngredientCheck(ingredient.id)}
                            className='border-2'
                          />
                          <Text className={cn(
                            'text-lg flex-1',
                            checkedIngredients.has(ingredient.id) && 'line-through text-gray-400'
                          )}>
                            {ingredient.name}
                          </Text>
                        </View>
                        <Text className={cn(
                          'text-lg font-medium',
                          checkedIngredients.has(ingredient.id) && 'line-through text-gray-400'
                        )}>
                          {adjustedAmount} {unit}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View> */}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
