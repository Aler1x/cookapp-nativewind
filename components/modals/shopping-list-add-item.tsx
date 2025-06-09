import { Text } from '../ui/text';
import { View } from '../ui/view';
import { Input } from '../ui/input';
import SelectList, { SelectListData } from '../ui/input-with-dropdown';
import { Button } from '../ui/button';
import React, { useState, useCallback } from 'react';
import { useShoppingListStore } from '~/stores/shopping';
import { API_ENDPOINTS_PREFIX, THEME } from '~/lib/constants';
import { useFetch } from '~/hooks/useFetch';
import { useAuth } from '@clerk/clerk-expo';
import { SearchProduct, SuccessResponse } from '~/types';
import { SearchUnit } from '~/types/shopping';
import { TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import BasicModal from '../ui/basic-modal';

interface ShoppingListAddItemModalProps {
  showAddItemModal: boolean;
  setShowAddItemModal: (show: boolean) => void;
}

const ShoppingListAddItemModal = ({ showAddItemModal, setShowAddItemModal }: ShoppingListAddItemModalProps) => {
  const [newItemName, setNewItemName] = useState<SelectListData | string>('');
  const [newItemAmount, setNewItemAmount] = useState<string>('');
  const [newItemUnit, setNewItemUnit] = useState<SelectListData | string>('');
  const { addItem, normalizeUnit } = useShoppingListStore();
  const { isSignedIn } = useAuth();
  const $fetch = useFetch();

  // Fetch products function for SelectList
  const fetchProducts = useCallback(
    async (query: string): Promise<SelectListData[]> => {
      if (!isSignedIn || !query.trim() || query.length < 2) {
        return [];
      }

      try {
        const response = await $fetch<SuccessResponse<SearchProduct[]>>(
          `${API_ENDPOINTS_PREFIX.node}/ingredients/search`,
          {
            method: 'POST',
            body: JSON.stringify({ query, limit: 3 }),
          }
        );

        if (response) {
          return response.data.map((product) => ({
            id: product.id, // Use name as id so setSelected gets the string value
            value: product.name,
          }));
        }

        return [];
      } catch (error) {
        console.error('Error searching products:', error);
        return [];
      }
    },
    [$fetch, isSignedIn]
  );

  // Fetch units function for SelectList
  const fetchUnits = useCallback(
    async (query: string): Promise<SelectListData[]> => {
      if (!isSignedIn || !query.trim() || query.length < 2) {
        return [];
      }

      try {
        const response = await $fetch<SearchUnit[]>(
          `${API_ENDPOINTS_PREFIX.spring}/units?name=${encodeURIComponent(query)}`
        );
        if (response) {
          return response.slice(0, 3).map((unit) => ({
            id: unit.id, // Use name as id so setSelected gets the string value
            value: `${unit.name.one} (${unit.name.many})`,
          }));
        }
        return [];
      } catch (error) {
        console.error('Error searching units:', error);
        return [];
      }
    },
    [$fetch, isSignedIn]
  );

  const resetForm = () => {
    setNewItemName('');
    setNewItemAmount('');
    setNewItemUnit('');
  };

  const handleAddItem = () => {
    if (newItemName && newItemAmount && newItemUnit) {
      const unitName = normalizeUnit(typeof newItemUnit === 'string' ? newItemUnit : newItemUnit.value);

      addItem({
        name: typeof newItemName === 'string' ? newItemName : newItemName.value,
        amount: parseFloat(newItemAmount) || 1,
        unit: unitName,
      });
      resetForm();
      setShowAddItemModal(false);
    }
  };

  return (
    <BasicModal isModalOpen={showAddItemModal} setIsModalOpen={setShowAddItemModal} className='gap-4'>
      {/* Header */}
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-semibold'>Add new item</Text>
        <TouchableOpacity onPress={() => setShowAddItemModal(false)}>
          <X size={24} color='#000' />
        </TouchableOpacity>
      </View>

      {/* Product Name Input with Search */}
      <View className='gap-1'>
        <Text className='text-sm font-medium mb-2'>Item Name</Text>

        <SelectList
          setSelected={useCallback((value) => setNewItemName(value), [])}
          placeholder='Enter item name'
          fetchItems={fetchProducts}
          search={true}
          searchPlaceholder='Search for products...'
          fontFamily='Comfortaa_400Regular'
          notFoundText='No products found'
          allowFreeText={true}
          boxStyles={{
            borderColor: THEME.light.colors.primary,
          }}
          dropdownStyles={{
            borderColor: THEME.light.colors.primary,
          }}
        />
      </View>

      {/* Amount Input */}
      <View className='gap-1'>
        <Text className='text-sm font-medium mb-2'>Amount</Text>
        <Input
          className='border border-gray-300 rounded-lg px-3 py-2'
          placeholder='Enter amount'
          value={newItemAmount}
          onChangeText={setNewItemAmount}
          keyboardType='numeric'
        />
      </View>

      {/* Unit Input with Search */}
      <View className='gap-1'>
        <Text className='text-sm font-medium mb-2'>Unit</Text>
        <SelectList
          setSelected={useCallback((value) => setNewItemUnit(value), [])}
          placeholder='Enter unit (e.g., cups, lbs, pieces)'
          fetchItems={fetchUnits}
          search={true}
          searchPlaceholder='Search for units...'
          fontFamily='Comfortaa_400Regular'
          notFoundText='No units found'
          boxStyles={{
            borderColor: THEME.light.colors.primary,
          }}
          dropdownStyles={{
            borderColor: THEME.light.colors.primary,
          }}
        />
      </View>

      {/* Action Buttons */}
      <View className='flex-row gap-3 mt-4'>
        <Button className='flex-1' onPress={handleAddItem} disabled={!newItemName || !newItemAmount || !newItemUnit}>
          <Text>Add</Text>
        </Button>
      </View>
    </BasicModal>
  );
};

export default ShoppingListAddItemModal;
