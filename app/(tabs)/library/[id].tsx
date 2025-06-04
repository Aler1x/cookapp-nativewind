import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useFetch } from '~/hooks/useFetch';
import { Collection } from '~/types/library';

export default function LibraryDetailPage() {
  const { id } = useLocalSearchParams();

  const $fetch = useFetch();
  const [collection, setCollection] = useState<Collection | null>(null);

  

  return (
    <SafeAreaView className='flex-1 bg-background' style={{ padding: 16 }}>
      <Text className='text-3xl font-bold'>Collection {id}</Text>
    </SafeAreaView>
  );
}