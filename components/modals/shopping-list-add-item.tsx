import { Text } from '../ui/text';
import { View } from '../ui/view';
import { Input } from '../ui/input';
import InputWithDropdown from '../ui/input-with-dropdown';
import { Button } from '../ui/button';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useShoppingListStore } from '~/stores/shopping';
import { API_ENDPOINTS_PREFIX } from '~/lib/constants';
import { useFetch } from '~/hooks/useFetch';
import { debounce } from '~/lib/debounce';
import { useAuth } from '@clerk/clerk-expo';
import { SearchItem, SearchUnit } from '~/types/shopping';

const ShoppingListAddItemModal = () => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState<string>('');

  // Search states
  const [productSuggestions, setProductSuggestions] = useState<SearchItem[]>([]);
  const [unitSuggestions, setUnitSuggestions] = useState<SearchUnit[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [isSearchingUnits, setIsSearchingUnits] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);
  // Replace selection flags with refs
  const isSelectingProductRef = useRef(false);
  const isSelectingUnitRef = useRef(false);

  const { addItem, normalizeUnit } = useShoppingListStore();

  const { isSignedIn } = useAuth();

  const $fetch = useFetch();

  // Search products by name
  const searchProducts = async (query: string) => {
    if (!isSignedIn || !query.trim() || query.length < 2) {
      setProductSuggestions([]);
      setShowProductSuggestions(false);
      return;
    }

    setIsSearchingProducts(true);
    try {
      const response = await $fetch<SearchItem[]>(`${API_ENDPOINTS_PREFIX.spring}/products?name=${encodeURIComponent(query)}`);
      if (response) {
        setProductSuggestions(response.slice(0, 3));
        setShowProductSuggestions(response.length > 0);
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
    if (!isSignedIn || !query.trim() || query.length < 2) {
      setUnitSuggestions([]);
      setShowUnitSuggestions(false);
      return;
    }

    setIsSearchingUnits(true);
    try {
      const response = await $fetch<SearchUnit[]>(`${API_ENDPOINTS_PREFIX.spring}/units?name=${encodeURIComponent(query)}`);
      if (response) {
        setUnitSuggestions(response.slice(0, 3));
        setShowUnitSuggestions(response.length > 0);
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
  const debouncedProductSearch = useCallback(debounce(searchProducts, 500), []);
  const debouncedUnitSearch = useCallback(debounce(searchUnits, 500), []);

  // Effect for product search
  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    if (isSelectingProductRef.current) {
      // Reset the selecting flag and skip this effect run
      isSelectingProductRef.current = false;
      return;
    }

    debouncedProductSearch(newItemName);
  }, [newItemName, debouncedProductSearch, isSignedIn]);

  // Effect for unit search
  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    if (isSelectingUnitRef.current) {
      isSelectingUnitRef.current = false;
      return;
    }

    debouncedUnitSearch(newItemUnit);
  }, [newItemUnit, debouncedUnitSearch, isSignedIn]);

  const handleProductSelect = (item: { id: string; label: string; value: SearchItem }) => {
    setNewItemName(item.value.name);
    setShowProductSuggestions(false);
    isSelectingProductRef.current = true;
  };

  const handleUnitSelect = (item: { id: string; label: string; value: SearchUnit }) => {
    setNewItemUnit(item.value.name.one);
    setShowUnitSuggestions(false);
    isSelectingUnitRef.current = true;
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
    if (newItemName.trim() && newItemAmount.trim()) {
      const unitName = normalizeUnit(newItemUnit.trim());

      addItem({
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount) || 1,
        unit: unitName,
      });
      resetForm();
    }
  };

  return (
    <>
      {/* Header */}
      <Text className='text-2xl font-bold mb-4'>Add Item</Text>

      {/* Product Name Input with Autocomplete */}
      <InputWithDropdown
        label='Item Name'
        placeholder='Enter item name'
        value={newItemName}
        onChangeText={(text) => {
          setNewItemName(text);
          if (!text.trim()) {
            setShowProductSuggestions(false);
          }
        }}
        items={productSuggestions.map((product) => ({
          id: product.id,
          label: product.name,
          value: product,
        }))}
        onItemSelect={handleProductSelect}
        showDropdown={showProductSuggestions}
        isLoading={isSearchingProducts}
        autoFocus
        className='mb-4 relative'
        onBottom={true}
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
        label='Unit'
        placeholder='Enter unit (e.g., cups, lbs, pieces)'
        value={newItemUnit}
        onChangeText={(text) => {
          setNewItemUnit(text);
          if (!text.trim()) {
            setShowUnitSuggestions(false);
          }
        }}
        items={unitSuggestions.map((unit) => ({
          id: unit.id,
          label: unit.name.one,
          value: unit,
        }))}
        onItemSelect={handleUnitSelect}
        showDropdown={showUnitSuggestions}
        isLoading={isSearchingUnits}
        className='mb-6 relative'
      />

      {/* Action Buttons */}
      <View className='flex-row gap-3'>
        <Button
          className='flex-1'
          onPress={handleAddItem}
          disabled={!newItemName.trim() || !newItemAmount.trim() || !newItemUnit.trim()}>
          <Text>Add</Text>
        </Button>
      </View>
    </>
  );
};

export default ShoppingListAddItemModal;
