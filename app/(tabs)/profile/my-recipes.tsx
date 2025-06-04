import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingButton } from '~/components/ui/floating-button';
import { Plus } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { useFetch } from '~/hooks/useFetch';
import { RecipesPage } from '~/types/recipe';
import RecipeCard from '~/components/recipe-card';
import { Text } from '~/components/ui/text';
import { useAuth } from '@clerk/clerk-expo';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';

export default function Page() {
  const { userId } = useAuth();
  const [recipes, setRecipes] = useState<RecipesPage | null>(null);
  const $fetch = useFetch();

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipes = await $fetch<RecipesPage>(`${API_ENDPOINTS_PREFIX.node}/users/${userId}/recipes`);
      setRecipes(recipes);
      console.log(recipes);
    };
    fetchRecipes();
  }, [userId, $fetch]);


  return (
    <SafeAreaView className='flex-1 items-center justify-center' style={{ padding: 16 }}>
      <FloatingButton onPress={() => {}}>
        <Plus size={24} />
      </FloatingButton>

      {recipes?.data?.length > 0 ? (
        <View className='flex-1'>
          {recipes?.data.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} size='small' />
          ))}
        </View>
      ) : (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-center font-medium'>No recipes found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
