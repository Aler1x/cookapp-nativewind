import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Edit, Trash2 } from 'lucide-react-native';

interface RecipeActionsProps {
  recipeName: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function RecipeActions({ recipeName, onEdit, onDelete, onClose }: RecipeActionsProps) {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <View className='gap-4'>
      <Text className='text-center text-lg font-semibold' numberOfLines={2}>
        {recipeName}
      </Text>
      <Text className='text-center text-muted-foreground text-sm'>
        What would you like to do?
      </Text>

      <View className='mt-2 gap-3'>
        <Button variant='outline' onPress={handleEdit}>
          <View className='flex-row items-center gap-2'>
            <Edit size={20} color='black' />
            <Text className='font-medium'>Edit Recipe</Text>
          </View>
        </Button>
        
        <Button variant='destructive' onPress={handleDelete}>
          <View className='flex-row items-center gap-2'>
            <Trash2 size={20} color='white' />
            <Text className='font-medium text-white'>Delete Recipe</Text>
          </View>
        </Button>
      </View>
    </View>
  );
} 