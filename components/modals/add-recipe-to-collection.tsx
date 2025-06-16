import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import SelectList from '~/components/ui/select-list';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { CollectionPreview } from '~/types/library';
import Toast from 'react-native-toast-message';

interface AddRecipeToCollectionModalProps {
  recipeId: string;
  recipeName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddRecipeToCollectionModal({
  recipeId,
  recipeName,
  onClose,
  onSuccess,
}: AddRecipeToCollectionModalProps) {
  const $fetch = useFetch();
  const [collections, setCollections] = useState<CollectionPreview[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCollection, setIsAddingToCollection] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await $fetch<{ collections: CollectionPreview[] }>(
        `${API_ENDPOINTS_PREFIX.spring}/recipes/collection/preview`
      );
      setCollections(response.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, [$fetch]);

  useEffect(() => {
    fetchCollections();
    setSelectedCollectionId('');
  }, [fetchCollections]);

  const handleAddToCollection = async () => {
    if (!selectedCollectionId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a collection',
      });
      return;
    }

    try {
      setIsAddingToCollection(true);
      await $fetch(
        `${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${selectedCollectionId}/recipe?recipeId=${recipeId}`,
        {
          method: 'POST',
        }
      );

      if (onSuccess) {
        onSuccess();
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: recipeName ? `"${recipeName}" added to collection!` : 'Recipe added to collection!',
        });
      }
    } catch (error) {
      console.error('Error adding recipe to collection:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add recipe to collection',
      });
    } finally {
      setIsAddingToCollection(false);
      onClose();
    }
  };

  const selectListData = collections.map((collection) => ({
    key: collection.id,
    value: collection.name,
  }));

  return (
    <View className='gap-4'>
      {/* Header */}
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-semibold'>Add to Collection</Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className='py-8'>
          <ActivityIndicator size='large' color={THEME.light.colors.primary} />
          <Text className='mt-4 text-center text-muted-foreground'>Loading collections...</Text>
        </View>
      ) : collections.length === 0 ? (
        <View className='py-8'>
          <Text className='text-center text-muted-foreground'>No collections found</Text>
          <Text className='mt-2 text-center text-sm text-muted-foreground'>
            Create a collection first to add recipes
          </Text>
        </View>
      ) : (
        <>
          <View className='gap-2'>
            <Text className='text-sm font-medium'>Select Collection</Text>
            <SelectList
              setSelected={setSelectedCollectionId}
              data={selectListData}
              placeholder='Choose a collection'
              save='key'
              fontFamily='System'
              boxStyles={{
                borderColor: THEME.light.colors.primary,
              }}
              dropdownStyles={{
                borderColor: THEME.light.colors.primary,
              }}
              searchPlaceholder='Search collections...'
              notFoundText='No collections found'
            />
          </View>

          <View className='mt-4 flex-row gap-3'>
            <Button
              className='flex-1 bg-primary'
              onPress={handleAddToCollection}
              disabled={!selectedCollectionId || isAddingToCollection}>
              {isAddingToCollection ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <Text className='text-white'>Add to Collection</Text>
              )}
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
