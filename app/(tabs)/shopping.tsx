import React, { useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { share } from '~/lib/share';
import Toast from 'react-native-toast-message';
import { useShoppingListStore } from '~/stores/shopping-list';
import { Checkbox } from '~/components/ui/checkbox';
import { FloatingButton } from '~/components/ui/floating-button';
import { Share2 } from '~/assets/icons';
import { KeyboardAvoidingView, Modal, Platform, SectionList } from 'react-native';
import ShoppingListAddItemModal from '~/components/modals/shopping-list-add-item';

export default function ShoppingListPage() {
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const { items, toggleItem, getUncheckedItems, getCheckedItems, formatShoppingListForSharing, normalizeUnit } =
    useShoppingListStore();

  const onShare = async () => {
    const shoppingListText = formatShoppingListForSharing();

    if (shoppingListText.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'No items to share',
      });
      return;
    }

    const result = await share('text', shoppingListText, {
      dialogTitle: 'Sharing shopping list',
    });

    if (result.error || !result.success) {
      Toast.show({
        type: 'error',
        text1: 'Error sharing shopping list',
        text2: result.error?.message || 'Unknown error occurred',
      });
    }
  };

  return (
    <SafeAreaView className='flex-1' style={{ padding: 16 }}>
      <Text className='text-2xl' style={{ fontFamily: 'Comfortaa_700Bold' }}>
        Shopping List
      </Text>

      {items.length > 0 && <SectionList
        sections={[{
          title: 'To buy',
          data: getUncheckedItems(),
        }, {
          title: 'Bought',
          data: getCheckedItems(),
        }]}
        renderItem={({ item }) => (
          <View key={item.id} className='flex-row items-center py-3 border-b border-gray-200 gap-4'>
            <Checkbox
              className='rounded-md w-7 h-7'
              checked={item.isChecked}
              onCheckedChange={() => {
                toggleItem(item.id);
              }}
            />
            <Text className='flex-1 text-lg'>{item.name}</Text>
            <Text className='text-gray-600 ml-2'>
              {item.amount} {normalizeUnit(item.unit)}
            </Text>
          </View>
        )}
      />}

      {items.length === 0 && (
        <View className='flex-1 justify-center items-center'>
          <Text className='text-center max-w-[80vw]'>
            Your shopping list is empty. find delicious recipes, add tho necessary ingredients to tho shopping list and
            cook something delicious
          </Text>
        </View>
      )}

      <View className='flex-row justify-center mb-4'>
        {items.some((item) => item.isChecked) && (
          <Button
            variant='ghost'
            onPress={() => {
              const { clearCheckedItems } = useShoppingListStore.getState();
              clearCheckedItems();
            }}>
            <Text>Clear Checked Items</Text>
          </Button>
        )}
      </View>

      <View className='flex-row justify-center'>
        <Button className='w-1/2' onPress={() => setShowAddItemModal(true)}>
          <Text>Add item</Text>
        </Button>
      </View>

      <Modal
        visible={showAddItemModal}
        transparent={true}
        animationType='fade'
        onAccessibilityEscape={() => setShowAddItemModal(false)}
        onRequestClose={() => setShowAddItemModal(false)}>
        <ShoppingListAddItemModal isOpen={showAddItemModal} onClose={() => setShowAddItemModal(false)} />
      </Modal>

      <FloatingButton onPress={onShare}>
        <Share2 size={24} />
      </FloatingButton>
    </SafeAreaView>
  );
}
