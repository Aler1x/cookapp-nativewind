import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFetch } from '~/hooks/useFetch';
import { Collection } from '~/types/library';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';

export default function LibraryDetailPage() {
  const { id, name } = useLocalSearchParams();

  const $fetch = useFetch();
  const [collection, setCollection] = useState<Collection | null>(null);

  const fetchCollection = async () => {
    const data = await $fetch<Collection>(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${id}`);
    console.log('data', data);
    setCollection(data);
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  return (
    <SafeAreaView className='flex-1 bg-background' style={{ padding: 16 }}>
      <Text className='text-3xl font-bold'>{name || `Collection`}</Text>
    </SafeAreaView>
  );
}
