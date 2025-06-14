import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { TouchableOpacity, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFetch } from '~/hooks/useFetch';
import { Collection } from '~/types/library';
import { Recipe } from '~/types/recipe';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { View } from '~/components/ui/view';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import BasicModal from '~/components/ui/basic-modal';
import DeleteConfirmationModal from '~/components/modals/delete-confirmation';
import { Edit, Trash2, Clock, Users } from 'lucide-react-native';

export default function LibraryDetailPage() {
  const { id, name } = useLocalSearchParams();

  const $fetch = useFetch();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedName, setEditedName] = useState('');

  const fetchCollection = async () => {
    const data = await $fetch<Collection>(`${API_ENDPOINTS_PREFIX.spring}/recipes/collection/${id}`);
    setCollection(data);
  };

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

  const openEditModal = () => {
    setEditedName(collection?.name || name?.toString() || '');
    setIsEditModalOpen(true);
  };

  const renderRecipeItem = (recipe: Recipe) => (
    <TouchableOpacity key={recipe.id} className='bg-card rounded-lg p-4 mb-3 shadow-sm'>
      <View className='flex-row'>
        <Image source={{ uri: recipe.mainImageUrl }} className='w-16 h-16 rounded-lg mr-3' resizeMode='cover' />
        <View className='flex-1'>
          <Text className='font-semibold text-lg mb-1'>{recipe.title}</Text>
          <Text className='text-muted-foreground text-sm mb-2 capitalize'>{recipe.difficulty}</Text>
          <View className='flex-row items-center gap-4'>
            <View className='flex-row items-center gap-1'>
              <Clock size={14} color='#666' />
              <Text className='text-xs text-muted-foreground'>{recipe.duration} min</Text>
            </View>
            <View className='flex-row items-center gap-1'>
              <Users size={14} color='#666' />
              <Text className='text-xs text-muted-foreground'>{recipe.servings} servings</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchCollection();
  }, [$fetch]);

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <ScrollView className='flex-1' contentContainerStyle={{ padding: 16 }}>
        <View className='flex-row items-center justify-between mb-6'>
          <Text className='text-3xl font-bold flex-1'>{collection?.name || name || 'Collection'}</Text>
          <View className='flex-row gap-2'>
            <Button variant='outline' size='icon' onPress={openEditModal}>
              <Edit size={18} color='#666' />
            </Button>
            <Button variant='outline' size='icon' onPress={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={18} color='#ef4444' />
            </Button>
          </View>
        </View>

        {collection?.recipes && collection.recipes.length > 0 ? (
          <View>
            <Text className='text-lg font-semibold mb-4'>Recipes ({collection.recipes.length})</Text>
            {collection.recipes.map(renderRecipeItem)}
          </View>
        ) : (
          <View className='flex-1 items-center justify-center py-12'>
            <Text className='text-muted-foreground text-center'>No recipes in this collection yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <BasicModal isModalOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen}>
        <View className='gap-4'>
          <Text className='text-xl font-bold text-center'>Edit Collection</Text>
          <View>
            <Text className='text-sm font-medium mb-2'>Collection Name</Text>
            <Input value={editedName} onChangeText={setEditedName} placeholder='Enter collection name' autoFocus />
          </View>
          <View className='flex-row gap-3 mt-4'>
            <Button variant='outline' className='flex-1' onPress={() => setIsEditModalOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button className='flex-1' onPress={handleEditCollection} disabled={!editedName.trim()}>
              <Text>Save</Text>
            </Button>
          </View>
        </View>
      </BasicModal>

      {/* Delete Modal */}
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
