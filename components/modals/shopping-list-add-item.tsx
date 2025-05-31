import { Text } from '../ui/text';
import { View } from '../ui/view';
import { Input } from '../ui/input';
import { InputWithDropdown } from '../ui/input-with-dropdown';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useState, useEffect, useCallback } from 'react';
import { useShoppingListStore } from '~/stores/shopping-list';
import { FlatList, Pressable, TouchableOpacity } from 'react-native';
import type { Ingredient, Unit } from '~/types/recipe';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { useApiFetch } from '~/lib/fetch';
import { useAuth } from '@clerk/clerk-expo';

interface ShoppingListAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingListAddItemModal = ({ isOpen, onClose }: ShoppingListAddItemModalProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState<string>('');

  // Search states
  const [productSuggestions, setProductSuggestions] = useState<Ingredient[]>([]);
  const [unitSuggestions, setUnitSuggestions] = useState<Unit[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [isSearchingUnits, setIsSearchingUnits] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  const { addItem, normalizeUnit } = useShoppingListStore();

  const { get } = useApiFetch();

  const { isSignedIn } = useAuth();

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Search products by name
  const searchProducts = async (query: string) => {
    if (!isSignedIn || !query.trim() || query.length < 2) {
      setProductSuggestions([]);
      setShowProductSuggestions(false);
      return;
    }

    setIsSearchingProducts(true);
    try {
      const response = await get(`${API_ENDPOINTS_PREFIX.spring}/products?name=${encodeURIComponent(query)}`);

      if (response.ok) {
        const products = response.data;
        console.log('Products received:', products);
        setProductSuggestions(products.slice(0, 5)); // Limit to 5 suggestions
        setShowProductSuggestions(products.length > 0);
        console.log('Show product suggestions:', products.length > 0);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProductSuggestions([]);
      setShowProductSuggestions(false);
    } finally {
      setIsSearchingProducts(false);
    }
  };

  // Search units by name
  const searchUnits = async (query: string) => {
    if (!isSignedIn || !query.trim() || query.length < 1) {
      setUnitSuggestions([]);
      setShowUnitSuggestions(false);
      return;
    }

    setIsSearchingUnits(true);
    try {
      const response = await get(`${API_ENDPOINTS_PREFIX.spring}/units?name=${encodeURIComponent(query)}`);

      if (response.ok) {
        const units = response.data;
        setUnitSuggestions(units.slice(0, 8)); // Limit to 8 suggestions
        setShowUnitSuggestions(units.length > 0);
      }
    } catch (error) {
      console.error('Error searching units:', error);
      setUnitSuggestions([]);
      setShowUnitSuggestions(false);
    } finally {
      setIsSearchingUnits(false);
    }
  };

  // Debounced search functions
  const debouncedProductSearch = useCallback(debounce(searchProducts, 300), [isSignedIn]);
  const debouncedUnitSearch = useCallback(debounce(searchUnits, 300), [isSignedIn]);

  // Effect for product search
  useEffect(() => {
    if (isSignedIn) {
      debouncedProductSearch(newItemName);
    } else {
      setProductSuggestions([]);
      setShowProductSuggestions(false);
    }
  }, [newItemName, debouncedProductSearch, isSignedIn]);

  // Effect for unit search
  useEffect(() => {
    if (isSignedIn) {
      debouncedUnitSearch(newItemUnit);
    } else {
      setUnitSuggestions([]);
      setShowUnitSuggestions(false);
    }
  }, [newItemUnit, debouncedUnitSearch, isSignedIn]);

  const handleProductSelect = (item: { id: string; label: string; value: Ingredient }) => {
    setNewItemName(item.value.name);
    setShowProductSuggestions(false);
  };

  const handleUnitSelect = (item: { id: string; label: string; value: Unit }) => {
    setNewItemUnit(item.value.name.one);
    setShowUnitSuggestions(false);
  };

  const resetForm = () => {
    setNewItemName('');
    setNewItemAmount('');
    setNewItemUnit('');
    setProductSuggestions([]);
    setUnitSuggestions([]);
    setShowProductSuggestions(false);
    setShowUnitSuggestions(false);
  };

  const handleAddItem = () => {
    if (newItemName.trim() && newItemAmount.trim() && newItemUnit.trim()) {
      const unitName = normalizeUnit(newItemUnit.trim());

      addItem({
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount) || 1,
        unit: unitName,
      });
      onClose();
      resetForm();
    }
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  return (
    <Pressable className='flex-1 justify-end bg-black/50' onPress={onClose}>
      {/* Modal with "prevent default" */}
      <Pressable className='bg-background rounded-t-2xl p-6 w-full shadow-2xl' onPress={() => {}} style={{ maxHeight: '80%' }}>  
        {/* Header */}
        <Text className='text-2xl font-bold mb-4'>Add Item</Text>

        {/* Product Name Input with Autocomplete */}
        <InputWithDropdown
          label="Item Name"
          placeholder="Enter item name"
          value={newItemName}
          onChangeText={(text) => {
            setNewItemName(text);
            if (!text.trim()) {
              setShowProductSuggestions(false);
            }
          }}
          items={productSuggestions.map(product => ({
            id: product.id,
            label: product.name,
            value: product
          }))}
          onItemSelect={handleProductSelect}
          showDropdown={showProductSuggestions}
          isLoading={isSearchingProducts}
          autoFocus
          className='mb-4 relative'
        />

        {/* Amount Input */}
        <View className='mb-4'>
          <Text className='text-sm font-medium mb-2'>Amount</Text>
          <Input
            className='border border-gray-300 rounded-lg px-3 py-2'
            placeholder='Enter amount'
            value={newItemAmount}
            onChangeText={setNewItemAmount}
            keyboardType='numeric'
          />
        </View>

        {/* Unit Input with Autocomplete */}
        <InputWithDropdown
          label="Unit"
          placeholder="Enter unit (e.g., cups, lbs, pieces)"
          value={newItemUnit}
          onChangeText={(text) => {
            setNewItemUnit(text);
            if (!text.trim()) {
              setShowUnitSuggestions(false);
            }
          }}
          items={unitSuggestions.map(unit => ({
            id: unit.id,
            label: unit.name.one,
            sublabel: unit.name.many !== unit.name.one ? `(${unit.name.many})` : undefined,
            value: unit
          }))}
          onItemSelect={handleUnitSelect}
          showDropdown={showUnitSuggestions}
          isLoading={isSearchingUnits}
          className='mb-6 relative'
        />

        {/* Action Buttons */}
        <View className='flex-row gap-3'>
          <Button variant='outline' className='flex-1' onPress={handleCancel}>
            <Text>Cancel</Text>
          </Button>
          <Button
            className='flex-1'
            onPress={handleAddItem}
            disabled={!newItemName.trim() || !newItemAmount.trim() || !newItemUnit.trim()}>
            <Text>Add</Text>
          </Button>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default ShoppingListAddItemModal;
