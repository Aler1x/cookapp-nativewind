import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { useLocalSearchParams } from 'expo-router';
import { useFetch } from '~/hooks/useFetch';
import { RecipeFull } from '~/types/recipe';

export default function Page() {
  const { isDarkColorScheme } = useColorScheme();
  const { id, slug } = useLocalSearchParams<{ id: string; slug: string }>();

  const $fetch = useFetch();

  React.useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await $fetch<RecipeFull>(`${API_ENDPOINTS_PREFIX.public}/recipes/${id}`);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecipe();
  }, [id, $fetch]);

  return (
    <SafeAreaView
      className='flex-1 items-center justify-center'
      style={{
        backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
      }}>
      <Text>Recipe Detail</Text>
      <Text>ID: {id}</Text>
      <Text>Slug: {slug}</Text>
    </SafeAreaView>
  );
}
