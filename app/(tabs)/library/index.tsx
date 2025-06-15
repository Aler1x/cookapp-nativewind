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
import { PlusIcon, Info } from 'lucide-react-native';
import { BookmarkPlus, Edit, Trash2, Heart } from '~/assets/icons';
import BasicModal from '~/components/ui/basic-modal';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import AuthPage from '~/components/pages/auth';
import HelpModal, { Option } from '~/components/modals/information';

export const LIBRARY_HELP_OPTIONS: Option[] = [
  {
    id: 1,
    icon: <BookmarkPlus className='h-5 w-5 text-primary' />,
    label: 'Create Collections',
    description: 'Organize your favorite recipes into custom collections',
  },
  {
    id: 2,
    icon: <Heart className='h-5 w-5 text-primary' />,
    label: 'Save Recipes',
    description: 'Add recipes to your collections from any recipe page',
  },
  {
    id: 3,
    icon: <Edit className='h-5 w-5 text-primary' />,
    label: 'Manage Collections',
    description: 'Edit collection names or delete entire collections',
  },
  {
    id: 4,
    icon: <Trash2 className='h-5 w-5 text-primary' />,
    label: 'Remove Recipes',
    description: 'Long press any recipe in a collection to remove it',
  },
];

export default function LibraryPage() {
  const { isSignedIn } = useAuth();
  const $fetch = useFetch();

  const [collections, setCollections] = useState<CollectionPage[]>([]);
  const [isCreateNewCollectionModalOpen, setIsCreateNewCollectionModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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

  return (
    <>
      {!isSignedIn && <AuthPage />}
      {isSignedIn && (
        <SafeAreaView className='flex-1 bg-background' style={{ padding: 16 }} edges={['top', 'bottom']}>
          <View className='w-full flex-row items-center justify-between'>
            <Text className='text-3xl font-bold'>Library</Text>
            <TouchableOpacity className='p-2' onPress={() => setIsHelpModalOpen(true)}>
              <Info className='h-8 w-8' />
            </TouchableOpacity>
          </View>
          <ScrollView className='mt-4' showsVerticalScrollIndicator={false}>
            <View className='flex w-full flex-row flex-wrap justify-between'>
              <TouchableOpacity className='w-[48%]' onPress={() => setIsCreateNewCollectionModalOpen(true)}>
                <View className='h-32 w-full items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30'>
                  <PlusIcon className='h-10 w-10 text-muted-foreground' />
                </View>
                <Text className='mt-2 text-left font-medium'>Create New Collection</Text>
              </TouchableOpacity>

              {collections?.map((collection) => (
                <LibraryCard key={collection.id} collection={collection} className='mb-2' />
              ))}
            </View>
          </ScrollView>

          {isLoading && (
            <View className='absolute bottom-0 left-0 right-0 top-0 items-center justify-center p-12'>
              <ActivityIndicator size='large' color={THEME.light.colors.primary} />
              <Text className='mt-4 text-lg font-medium'>Loading your collections...</Text>
            </View>
          )}

          <BasicModal isModalOpen={isHelpModalOpen} setIsModalOpen={setIsHelpModalOpen}>
            <HelpModal
              title='How to use your Library'
              options={LIBRARY_HELP_OPTIONS}
              onClose={() => setIsHelpModalOpen(false)}
            />
          </BasicModal>

          <BasicModal isModalOpen={isCreateNewCollectionModalOpen} setIsModalOpen={setIsCreateNewCollectionModalOpen}>
            <Text className='mb-4 text-2xl font-semibold'>Create New Collection</Text>

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
      )}
    </>
  );
}
