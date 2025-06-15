import React, { useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { share } from '~/lib/share';
import Toast from 'react-native-toast-message';
import { useShoppingListStore } from '~/stores/shopping';
import { Checkbox } from '~/components/ui/checkbox';
import { Share2 } from '~/assets/icons';
import { SectionList, TouchableOpacity } from 'react-native';
import ShoppingListAddItemModal from '~/components/modals/shopping-list-add-item';
import { ShoppingListItem as ShoppingListItemType } from '~/types/shopping';
import { Plus } from 'lucide-react-native';

const ShoppingListItem = ({
  item,
  toggleItem,
  normalizeUnit,
}: {
  item: ShoppingListItemType;
  toggleItem: (id: string) => void;
  normalizeUnit: (unit: string) => string;
}) => {
  return (
    <View key={item.id} className='flex-row items-center gap-4 border-b border-gray-200 py-3'>
      <Checkbox
        className='h-7 w-7 rounded-md'
        variant='black'
        checked={item.isChecked}
        onCheckedChange={() => {
          toggleItem(item.id);
        }}
      />
      <Text className='flex-1 text-lg'>{item.name}</Text>
      <Text className='ml-2 font-light text-gray-600'>
        {item.amount} {normalizeUnit(item.unit)}
      </Text>
    </View>
  );
};

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
    <SafeAreaView className='flex-1 bg-background' style={{ padding: 16 }} edges={['top']}>
      <View className='flex-row items-center justify-between'>
        <Text className='text-3xl font-bold'>Shopping List</Text>
        <TouchableOpacity onPress={onShare} className='p-2'>
          <Share2 size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {items.length > 0 && (
        <SectionList
          sections={[
            {
              title: 'To buy',
              data: getUncheckedItems(),
            },
            ...(getCheckedItems().length > 0
              ? [
                  {
                    title: 'Bought',
                    data: getCheckedItems(),
                  },
                ]
              : []),
          ]}
          renderSectionHeader={({ section: { title } }) =>
            title === 'Bought' ? (
              <View className='flex-row items-center justify-between py-2'>
                <Text className='my-2 text-lg font-semibold'>{title}</Text>
                <Button
                  variant='outline'
                  onPress={() => {
                    const { clearCheckedItems } = useShoppingListStore.getState();
                    clearCheckedItems();
                  }}>
                  <Text>Clear Checked Items</Text>
                </Button>
              </View>
            ) : (
              <Text className='my-2 text-lg font-semibold'>{title}</Text>
            )
          }
          renderItem={({ item }) => (
            <ShoppingListItem item={item} toggleItem={toggleItem} normalizeUnit={normalizeUnit} />
          )}
          ListEmptyComponent={
            <View className='flex-1 items-center justify-center'>
              <Text className='max-w-[80vw] text-center'>
                Your shopping list is empty. Let&apos;s find delicious recipes, add the necessary ingredients to the
                shopping list and cook something delicious!
              </Text>
            </View>
          }
        />
      )}

      <View className='absolute bottom-0 left-0 right-0 items-center pb-8'>
        <Button
          variant='black'
          className='w-[60%]'
          onPress={() => setShowAddItemModal(true)}
          style={{
            elevation: 10,
          }}>
          <View className='flex-row items-center gap-2'>
            <Plus size={24} color='white' />
            <Text className='font-medium text-white'>Add Item</Text>
          </View>
        </Button>
      </View>

      <ShoppingListAddItemModal showAddItemModal={showAddItemModal} setShowAddItemModal={setShowAddItemModal} />
    </SafeAreaView>
  );
}
