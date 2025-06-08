import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { ScrollView } from 'react-native';
import { useFetch } from '~/hooks/useFetch';
import { debounce } from '~/lib/debounce';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { Recipe, RecipesPage } from '~/types/recipe';
import RecipeCard from '~/components/recipe-card';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const [showTitle, setShowTitle] = useState(true);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const $fetch = useFetch();

  const fetchRecipes = useCallback(async () => {
    try {
      const fetchedRecipes = await $fetch<RecipesPage>(`${API_ENDPOINTS_PREFIX.node}/recommendations`);
      setRecipes(fetchedRecipes.data);
      console.log(fetchedRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  }, [$fetch]);

  const fetchRecipesGuest = useCallback(async () => {
    try {
      const fetchedRecipes = await $fetch<RecipesPage>(`${API_ENDPOINTS_PREFIX.public}/recipes`);
      setRecipes(fetchedRecipes.data);
      // console.log(fetchedRecipes);
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
    </SafeAreaView>
  );
}
