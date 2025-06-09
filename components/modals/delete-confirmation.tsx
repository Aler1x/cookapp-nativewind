import React from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import BasicModal from '~/components/ui/basic-modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  onApprove: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onReject,
  onApprove,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete',
  itemName = 'this item'
}: DeleteConfirmationModalProps) {
  const handleReject = () => {
    onReject();
    onClose();
  };

  const handleApprove = () => {
    onApprove();
    onClose();
  };

  return (
    <BasicModal isModalOpen={isOpen} setIsModalOpen={onClose}>
      <View className='gap-4'>
        <Text className='text-xl font-bold text-center'>{title}</Text>
        <Text className='text-center text-muted-foreground'>
          {message} &quot;{itemName}&quot;? This action cannot be undone.
        </Text>
        
        <View className='flex-row gap-3 mt-4'>
          <Button 
            variant='outline' 
            className='flex-1' 
            onPress={handleReject}
          >
            <Text>Cancel</Text>
          </Button>
          <Button 
            variant='destructive' 
            className='flex-1' 
            onPress={handleApprove}
          >
            <Text>Delete</Text>
          </Button>
        </View>
      </View>
    </BasicModal>
  );
} 