import React, { useState, useEffect } from 'react';
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
import { Input } from '~/components/ui/input';
import { Modal } from 'react-native';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useUnits, useUnitGetters } from '~/stores/units';

export default function ShoppingListPage() {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState<{ value: string; label: string } | null>(null);

  const { items, toggleItem, getUncheckedItems, getCheckedItems, formatShoppingListForSharing, addItem } =
    useShoppingListStore();
  const { units, isLoading: unitsLoading, prefetchIfNeeded } = useUnits();
  const { getUnitsByType, getUnitById, normalizeUnit } = useUnitGetters();

  useEffect(() => {
    prefetchIfNeeded().catch(console.error);
  }, [prefetchIfNeeded]);

  const getUnitDisplayName = (unitId: string, amount: number) => {
    const unit = getUnitById(unitId);
    if (!unit) return unitId;

    return amount === 1 ? unit.name.one : unit.name.many;
  };

  const getItemUnitDisplay = (item: any) => {
    if (typeof item.unit === 'string') {
      const unit = units.find((u) => u.name.one === item.unit || u.name.many === item.unit || u.id === item.unit);
      if (unit) {
        return item.amount === 1 ? unit.name.one : unit.name.many;
      }
      return item.unit;
    }

    // If it's an object with ID, use the helper function
    return getUnitDisplayName(item.unit, item.amount);
  };

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

      <View className='flex-1 p-2'>
        {/* Unchecked items first */}
        {getUncheckedItems().map((item) => (
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
              {item.amount} {getItemUnitDisplay(item)}
            </Text>
          </View>
        ))}

        {/* Checked items at the bottom */}
        {getCheckedItems().map((item) => (
          <View key={item.id} className='flex-row items-center py-3 border-b border-gray-200 gap-4 opacity-60'>
            <Checkbox
              className='rounded-md w-7 h-7'
              checked={item.isChecked}
              onCheckedChange={() => {
                toggleItem(item.id);
              }}
            />
            <Text className='flex-1 text-lg line-through'>{item.name}</Text>
            <Text className='text-gray-600 ml-2 line-through'>
              {item.amount} {getItemUnitDisplay(item)}
            </Text>
          </View>
        ))}
      </View>

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
        <View className='flex-1 justify-center items-center bg-black/50'>
          <View className='bg-white rounded-lg p-6 mx-4 w-80'>
            <Text className='text-xl font-bold mb-4'>Add Item</Text>

            <View className='mb-4'>
              <Text className='text-sm font-medium mb-2'>Item Name</Text>
              <Input
                className='border border-gray-300 rounded-lg px-3 py-2'
                placeholder='Enter item name'
                value={newItemName}
                onChangeText={setNewItemName}
                autoFocus
              />
            </View>

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

            <View className='mb-6'>
              <Text className='text-sm font-medium mb-2'>Unit</Text>
              {units.length > 0 ? (
                <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                  <SelectTrigger className='border border-gray-300 rounded-lg'>
                    <SelectValue placeholder={unitsLoading ? 'Loading units...' : 'Select a unit'} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Volume Units */}
                    <SelectGroup>
                      <SelectLabel>Volume</SelectLabel>
                      {getUnitsByType('volume').map((unit) => (
                        <SelectItem key={unit.id} value={unit.id} label={unit.name.one}>
                          <Text>{unit.name.one}</Text>
                        </SelectItem>
                      ))}
                    </SelectGroup>

                    {/* Weight Units */}
                    <SelectGroup>
                      <SelectLabel>Weight</SelectLabel>
                      {getUnitsByType('weight').map((unit) => (
                        <SelectItem key={unit.id} value={unit.id} label={unit.name.one}>
                          <Text>{unit.name.one}</Text>
                        </SelectItem>
                      ))}
                    </SelectGroup>

                    {/* Count/Piece Units */}
                    <SelectGroup>
                      <SelectLabel>Count</SelectLabel>
                      {getUnitsByType('count').map((unit) => (
                        <SelectItem key={unit.id} value={unit.id} label={unit.name.one}>
                          <Text>{unit.name.one}</Text>
                        </SelectItem>
                      ))}
                    </SelectGroup>

                    {/* Other Units */}
                    {getUnitsByType('other').length > 0 && (
                      <SelectGroup>
                        <SelectLabel>Other</SelectLabel>
                        {getUnitsByType('other').map((unit) => (
                          <SelectItem key={unit.id} value={unit.id} label={unit.name.one}>
                            <Text>{unit.name.one}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}

                    {/* Fallback: Show all units if no types are found */}
                    {units.length > 0 &&
                      getUnitsByType('volume').length === 0 &&
                      getUnitsByType('weight').length === 0 &&
                      getUnitsByType('count').length === 0 && (
                        <SelectGroup>
                          <SelectLabel>All Units</SelectLabel>
                          {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id} label={unit.name.one}>
                              <Text>{unit.name.one}</Text>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  className='border border-gray-300 rounded-lg px-3 py-2'
                  placeholder={unitsLoading ? 'Loading units...' : 'Enter unit (e.g., cups, lbs, pieces)'}
                  value={newItemUnit?.label || ''}
                  onChangeText={(text) => setNewItemUnit({ value: text, label: text })}
                  editable={!unitsLoading}
                />
              )}
            </View>

            <View className='flex-row gap-3'>
              <Button
                variant='outline'
                className='flex-1'
                onPress={() => {
                  setShowAddItemModal(false);
                  setNewItemName('');
                  setNewItemAmount('');
                  setNewItemUnit(null);
                }}>
                <Text>Cancel</Text>
              </Button>
              <Button
                className='flex-1'
                onPress={() => {
                  if (newItemName.trim() && newItemAmount.trim() && newItemUnit) {
                    let unitName = newItemUnit.value;

                    // If units are loaded and we have a unit ID, get the canonical name
                    if (units.length > 0) {
                      const selectedUnit = getUnitById(newItemUnit.value);
                      if (selectedUnit) {
                        unitName = selectedUnit.name.one;
                      } else {
                        // If not found by ID, normalize the entered text
                        unitName = normalizeUnit(newItemUnit.value);
                      }
                    } else {
                      // If units aren't loaded, normalize the entered text
                      unitName = normalizeUnit(newItemUnit.value);
                    }

                    addItem({
                      name: newItemName.trim(),
                      amount: parseFloat(newItemAmount) || 1,
                      unit: unitName,
                    });
                    setShowAddItemModal(false);
                    setNewItemName('');
                    setNewItemAmount('');
                    setNewItemUnit(null);
                  }
                }}>
                <Text>Add</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <FloatingButton onPress={onShare}>
        <Share2 size={24} />
      </FloatingButton>
    </SafeAreaView>
  );
}
