import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { FlatList, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useFetch } from '~/hooks/useFetch';
import { Collection } from '~/types/library';
import { Recipe } from '~/types/recipe';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { View } from '~/components/ui/view';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import BasicModal from '~/components/ui/basic-modal';
import DeleteConfirmationModal from '~/components/modals/delete-confirmation';
import { Edit, Trash2 } from 'lucide-react-native';
import RecipeCard from '~/components/recipe-card';

export default function LibraryDetailPage() {
  const { id, name } = useLocalSearchParams();

  const $fetch = useFetch();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteRecipeModalOpen, setIsDeleteRecipeModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await $fetch<Collection>(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${id}`);
      setCollection(data);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setIsLoading(false);
    }
  }, [$fetch, id]);

  const handleEditCollection = async () => {
    if (!editedName.trim()) return;

    try {
      await $fetch(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editedName }),
        headers: { 'Content-Type': 'application/json' },
      });

      // Update local state
      if (collection) {
        setCollection({ ...collection, name: editedName });
      }

      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  const handleDeleteCollection = async () => {
    try {
      await $fetch(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${id}`, {
        method: 'DELETE',
      });

      router.replace('/(tabs)/library');
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleRecipeLongPress = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setIsDeleteRecipeModalOpen(true);
  };

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      await $fetch(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${id}/recipe/${recipeToDelete.id}`, {
        method: 'DELETE',
      });

      // Update local state by removing the deleted recipe
      if (collection) {
        const updatedRecipes = collection.recipes.filter((recipe) => recipe.id !== recipeToDelete.id);
        setCollection({ ...collection, recipes: updatedRecipes });
      }

      setRecipeToDelete(null);
    } catch (error) {
      console.error('Error removing recipe from collection:', error);
    }
  };

  const openEditModal = () => {
    setEditedName(collection?.name || name?.toString() || '');
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchCollection();
  }, [$fetch]);

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <View className='flex-1' style={{ padding: 16 }}>
        <View className='mb-6 flex-row items-center justify-between'>
          <Text className='flex-1 text-3xl font-bold'>{collection?.name || name || 'Collection'}</Text>
          <View className='flex-row gap-2'>
            <Button variant='outline' size='icon' onPress={openEditModal}>
              <Edit size={18} color='#666' />
            </Button>
            <Button variant='outline' size='icon' onPress={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={18} color='#ef4444' />
            </Button>
          </View>
        </View>

        {isLoading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color={THEME.light.colors.primary} />
            <Text className='mt-4 text-lg font-medium'>Loading collection...</Text>
          </View>
        ) : collection?.recipes && collection.recipes.length > 0 ? (
          <View className='flex-1'>
            <Text className='mb-4 text-lg font-semibold'>Recipes ({collection.recipes.length})</Text>
            <FlatList
              data={collection.recipes}
              renderItem={({ item }) => (
                <RecipeCard recipe={item} className='mx-1 h-52 flex-1' onLongPress={handleRecipeLongPress} />
              )}
              keyExtractor={(item: Recipe, index: number) => `${item.id}-${index}`}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
              showsVerticalScrollIndicator={false}
              refreshing={isLoading}
              onRefresh={fetchCollection}
              ListEmptyComponent={
                <View className='flex-1 items-center justify-center py-12'>
                  <Text className='text-center text-muted-foreground'>No recipes in this collection yet</Text>
                </View>
              }
            />
          </View>
        ) : (
          <View className='flex-1 items-center justify-center py-12'>
            <Text className='text-center text-muted-foreground'>No recipes in this collection yet</Text>
          </View>
        )}
      </View>

      {/* Edit Modal */}
      <BasicModal isModalOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen}>
        <View className='gap-4'>
          <Text className='text-center text-xl font-bold'>Edit Collection</Text>
          <View>
            <Text className='mb-2 text-sm font-medium'>Collection Name</Text>
            <Input value={editedName} onChangeText={setEditedName} placeholder='Enter collection name' autoFocus />
          </View>
          <View className='mt-4 flex-row gap-3'>
            <Button variant='outline' className='flex-1' onPress={() => setIsEditModalOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button className='flex-1' onPress={handleEditCollection} disabled={!editedName.trim()}>
              <Text>Save</Text>
            </Button>
          </View>
        </View>
      </BasicModal>

      {/* Delete Recipe Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteRecipeModalOpen}
        onClose={() => {
          setIsDeleteRecipeModalOpen(false);
          setRecipeToDelete(null);
        }}
        onReject={() => console.log('Recipe delete cancelled')}
        onApprove={handleDeleteRecipe}
        itemName={recipeToDelete?.title || 'this recipe'}
        message='Are you sure you want to remove'
        title='Remove Recipe'
      />

      {/* Delete Collection Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onReject={() => console.log('Delete cancelled')}
        onApprove={handleDeleteCollection}
        itemName={collection?.name || name?.toString() || 'this collection'}
        message='Are you sure you want to delete'
      />
    </SafeAreaView>
  );
}
