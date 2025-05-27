import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingListItem } from '~/types/shopping';
import { ShoppingListStore } from '~/types/storage';
import { useUnitsStore } from './units';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Use the units store for normalization
          const unitsState = useUnitsStore.getState();
          const normalizedUnit = unitsState.normalizeUnit(item.unit);

          // Check if item with same name and unit already exists
          const existingItemIndex = state.items.findIndex(
            (existingItem) =>
              existingItem.name.toLowerCase() === item.name.toLowerCase() &&
              unitsState.normalizeUnit(existingItem.unit) === normalizedUnit
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
    }),
    {
      name: 'shopping-list-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
