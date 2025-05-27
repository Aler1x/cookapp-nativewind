# Shopping List Integration with Units Store

This example shows how to enhance your existing shopping list store by integrating it with the units store for better unit normalization and merging.

## Enhanced Shopping List Store

Here's how you can update your existing shopping list store to use the units store:

```tsx
// stores/shopping-list-enhanced.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingListItem } from '~/types/shopping';
import { ShoppingListStore } from '~/types/storage';
import { useUnitsStore } from './units';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Enhanced unit normalization using the units store
const normalizeUnitWithStore = (unit: string): string => {
  // Try to get the unit from the units store first
  const unitsState = useUnitsStore.getState();
  const foundUnit = unitsState.getUnitByName(unit);

  if (foundUnit) {
    return foundUnit.name.one; // Use the canonical "one" form
  }

  // Fallback to the existing hardcoded mapping for backwards compatibility
  const unitLower = unit.toLowerCase().trim();
  const unitMap: { [key: string]: string } = {
    // Keep your existing mapping as fallback
    cup: 'cup',
    c: 'cup',
    'fl oz': 'fl oz',
    // ... rest of your existing mapping
  };

  return unitMap[unitLower] || unit;
};

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const normalizedUnit = normalizeUnitWithStore(item.unit);

          // Check if item with same name and unit already exists
          const existingItemIndex = state.items.findIndex(
            (existingItem) =>
              existingItem.name.toLowerCase() === item.name.toLowerCase() &&
              normalizeUnitWithStore(existingItem.unit) === normalizedUnit
          );

          if (existingItemIndex !== -1) {
            // Merge amounts if item exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              amount: updatedItems[existingItemIndex].amount + item.amount,
            };
            return { items: updatedItems };
          } else {
            // Add new item
            const newItem: ShoppingListItem = {
              ...item,
              id: generateId(),
              unit: normalizedUnit,
              isChecked: false,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      // Enhanced recipe ingredient addition with better unit handling
      addIngredientsFromRecipe: (ingredients, recipeId, recipeName) => {
        const unitsState = useUnitsStore.getState();

        ingredients.forEach((ingredient) => {
          const amount = ingredient.measurements?.amount || 1;
          let unit = 'piece'; // default fallback

          // Try to get the unit from the ingredient's unit object
          if (ingredient.measurements?.unit?.id) {
            const foundUnit = unitsState.getUnitById(ingredient.measurements.unit.id);
            unit = foundUnit ? foundUnit.name.one : ingredient.measurements.unit.name?.one || 'piece';
          } else if (ingredient.measurements?.unit?.name?.one) {
            unit = ingredient.measurements.unit.name.one;
          }

          get().addItem({
            name: ingredient.name,
            amount,
            unit,
          });
        });
      },

      // Add a method to get units by type for better organization
      getItemsByUnitType: (unitType: string) => {
        const unitsState = useUnitsStore.getState();
        const unitsOfType = unitsState.getUnitsByType(unitType);
        const unitNames = unitsOfType.map((unit) => unit.name.one);

        return get().items.filter((item) => unitNames.includes(normalizeUnitWithStore(item.unit)));
      },

      // Enhanced formatting with proper unit display
      formatShoppingListForSharing: () => {
        const unitsState = useUnitsStore.getState();

        return get()
          .items.filter((item) => !item.isChecked)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => {
            // Try to get the proper unit display name
            const unit = unitsState.getUnitByName(item.unit);
            const displayUnit = item.amount === 1 ? unit?.name.one || item.unit : unit?.name.many || item.unit;

            return `${item.amount} ${displayUnit} ${item.name}`;
          })
          .join('\n');
      },

      // Rest of your existing methods remain the same
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item)),
        }));
      },

      updateItemAmount: (id, amount) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, amount } : item)),
        }));
      },

      clearCheckedItems: () => {
        set((state) => ({
          items: state.items.filter((item) => !item.isChecked),
        }));
      },

      clearAllItems: () => {
        set({ items: [] });
      },

      getUncheckedItems: () => {
        return get()
          .items.filter((item) => !item.isChecked)
          .sort((a, b) => a.name.localeCompare(b.name));
      },

      getCheckedItems: () => {
        return get()
          .items.filter((item) => item.isChecked)
          .sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
    {
      name: 'shopping-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Usage in Components

### Shopping List Component with Unit Type Grouping

```tsx
// components/ShoppingListByCategory.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useShoppingListStore } from '~/stores/shopping-list';
import { useUnitGetters } from '~/stores/units';

export function ShoppingListByCategory() {
  const { items } = useShoppingListStore();
  const { getUnitsByType } = useUnitGetters();

  // Group items by unit type
  const groupedItems = React.useMemo(() => {
    const groups: { [key: string]: typeof items } = {};

    items.forEach((item) => {
      // Find the unit type for this item
      const volumeUnits = getUnitsByType('volume').map((u) => u.name.one);
      const weightUnits = getUnitsByType('weight').map((u) => u.name.one);
      const countUnits = getUnitsByType('count').map((u) => u.name.one);

      let category = 'Other';
      if (volumeUnits.includes(item.unit)) {
        category = 'Volume';
      } else if (weightUnits.includes(item.unit)) {
        category = 'Weight';
      } else if (countUnits.includes(item.unit)) {
        category = 'Count';
      }

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return groups;
  }, [items, getUnitsByType]);

  return (
    <View>
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <View key={category}>
          <Text className='text-lg font-bold'>{category}</Text>
          <FlatList
            data={categoryItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className='flex-row justify-between p-2'>
                <Text>
                  {item.amount} {item.unit} {item.name}
                </Text>
                <Checkbox checked={item.isChecked} />
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}
```

### Recipe to Shopping List with Better Unit Handling

```tsx
// components/AddToShoppingListButton.tsx
import React from 'react';
import { Button } from '~/components/ui/button';
import { useShoppingListStore } from '~/stores/shopping-list';
import { useUnits } from '~/stores/units';
import { Recipe } from '~/types/recipe';

interface Props {
  recipe: Recipe;
}

export function AddToShoppingListButton({ recipe }: Props) {
  const { addIngredientsFromRecipe } = useShoppingListStore();
  const { prefetchIfNeeded } = useUnits();

  const handleAddToShoppingList = async () => {
    // Ensure units are loaded before adding ingredients
    await prefetchIfNeeded();

    // Now add ingredients with proper unit normalization
    addIngredientsFromRecipe(recipe.ingredients, recipe.id, recipe.title);
  };

  return <Button onPress={handleAddToShoppingList}>Add to Shopping List</Button>;
}
```

## Migration Strategy

If you want to gradually migrate your existing shopping list store:

1. **Keep the existing store** as is for now
2. **Add the units store** and start prefetching units
3. **Create a new enhanced version** of the shopping list store
4. **Test the new version** in parallel
5. **Gradually migrate components** to use the new store
6. **Remove the old store** once migration is complete

## Benefits of Integration

1. **Consistent Unit Names**: All units use the canonical form from the backend
2. **Better Merging**: More accurate merging of items with different unit spellings
3. **Proper Pluralization**: Correct singular/plural forms in displays
4. **Type Safety**: Better TypeScript support with proper unit types
5. **Centralized Unit Logic**: Single source of truth for all unit-related operations
6. **Automatic Updates**: Unit changes from backend are automatically reflected

## Testing the Integration

```tsx
// Example test to verify unit normalization works
const testUnitNormalization = () => {
  const store = useShoppingListStore.getState();

  // Add items with different unit spellings
  store.addItem({ name: 'Milk', amount: 1, unit: 'cup' });
  store.addItem({ name: 'Milk', amount: 2, unit: 'c' }); // Should merge
  store.addItem({ name: 'Milk', amount: 0.5, unit: 'Cup' }); // Should merge

  const items = store.getUncheckedItems();
  const milkItems = items.filter((item) => item.name === 'Milk');

  // Should have only 1 milk item with amount 3.5
  console.log('Milk items:', milkItems);
};
```
