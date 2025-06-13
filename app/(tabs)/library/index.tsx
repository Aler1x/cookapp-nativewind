import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { View } from '~/components/ui/view';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import LibraryCard from '~/components/library-card';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import type { CollectionPage } from '~/types/library';
import { useAuth } from '@clerk/clerk-expo';
import { PlusIcon } from 'lucide-react-native';
import BasicModal from '~/components/ui/basic-modal';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

export default function LibraryPage() {
  const { isSignedIn } = useAuth();
  const $fetch = useFetch();

  const [collections, setCollections] = useState<CollectionPage[]>([]);
  const [isCreateNewCollectionModalOpen, setIsCreateNewCollectionModalOpen] = useState(false);

  // Create New Collection
  const [collectionName, setCollectionName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedCollections = await $fetch<{ collections: CollectionPage[] }>(
        `${API_ENDPOINTS_PREFIX.spring}/recipes/collection`
      );
      setCollections(fetchedCollections.collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [$fetch]);

  useEffect(() => {
    if (isSignedIn) {
      fetchCollections();
    }
  }, [isSignedIn, fetchCollections]);

  const handleCreateNewCollection = useCallback(
    async (collectionName: string) => {
      try {
        await $fetch(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection`, {
          method: 'POST',
          body: JSON.stringify({
            name: collectionName,
            description: '',
          }),
        });
        console.log('New collection created:', collectionName);
        setCollectionName('');
        setIsCreateNewCollectionModalOpen(false);
        fetchCollections();
      } catch (error) {
        console.error('Error creating new collection:', error);
      }
    },
    [$fetch, fetchCollections]
  );

  if (!isSignedIn) {
    return (
      <SafeAreaView className='flex-1 bg-background' style={{ padding: 16 }}>
        <Text className='text-3xl font-bold'>Library</Text>
        <View className='flex-1 items-center justify-center gap-2'>
          <Text className='text-lg font-medium'>Please sign in to view or create collections</Text>
          <Button onPress={() => router.push('/(tabs)/profile')} variant='black' className='w-[60vw]'>
            <Text className='text-sm font-medium'>Sign in</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-background' style={{ padding: 16 }} edges={['top', 'bottom']}>
      <Text className='text-3xl font-bold'>Library</Text>
      <ScrollView className='mt-4' showsVerticalScrollIndicator={false}>
        <View className='flex flex-row flex-wrap w-full justify-between'>
          <TouchableOpacity className='w-[48%]' onPress={() => setIsCreateNewCollectionModalOpen(true)}>
            <View className='border-2 border-dashed border-muted-foreground/30 rounded-xl w-full h-32 items-center justify-center'>
              <PlusIcon className='w-10 h-10 text-muted-foreground' />
            </View>
            <Text className='font-medium text-left mt-2'>Create New Collection</Text>
          </TouchableOpacity>

          {collections?.map((collection) => (
            <LibraryCard key={collection.id} collection={collection} className='mb-2' />
          ))}
        </View>
      </ScrollView>

      {isLoading && (
        <View className='items-center justify-center absolute top-0 left-0 right-0 bottom-0 p-12'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
          <Text className='text-lg font-medium mt-4'>Loading your collections...</Text>
        </View>
      )}

      <BasicModal isModalOpen={isCreateNewCollectionModalOpen} setIsModalOpen={setIsCreateNewCollectionModalOpen}>
        <Text className='text-2xl font-semibold mb-4'>Create New Collection</Text>

        <View className='mb-4'>
          <Input placeholder='Enter collection name' value={collectionName} onChangeText={setCollectionName} />
        </View>

        <Button onPress={() => handleCreateNewCollection(collectionName)}>
          <View className='flex-row items-center gap-2'>
            <Text className='text-sm font-medium'>Create Collection</Text>
          </View>
        </Button>
      </BasicModal>
    </SafeAreaView>
  );
}
