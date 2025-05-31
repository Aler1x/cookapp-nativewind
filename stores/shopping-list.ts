import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingListItem } from '~/types/shopping';

export interface ShoppingListStore {
  items: ShoppingListItem[];
  addItem: (item: Omit<ShoppingListItem, 'id' | 'isChecked'>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  updateItemAmount: (id: string, amount: number) => void;
  clearCheckedItems: () => void;
  clearAllItems: () => void;
  getUncheckedItems: () => ShoppingListItem[];
  getCheckedItems: () => ShoppingListItem[];
  formatShoppingListForSharing: () => string;

  normalizeUnit: (unit: string) => string;
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set, get) => ({
      items: [],

      normalizeUnit: (unit: string): string => {
        const unitLower = unit.toLowerCase().trim();
        const unitMap: { [key: string]: string } = {
          // Volume - Imperial
          cup: 'cup',
          c: 'cup',
          'fl oz': 'fl oz',
          'fluid ounce': 'fl oz',
          'fluid ounces': 'fl oz',
          quart: 'quart',
          quarts: 'quarts',
          pint: 'pint',
          gallon: 'gallon',

          // Volume - Metric
          ml: 'ml',
          milliliter: 'ml',
          milliliters: 'ml',
          l: 'l',
          liter: 'l',
          liters: 'l',
          litre: 'l',
          litres: 'l',
          cl: 'cl',
          centiliter: 'cl',
          centiliters: 'cl',

          // Weight - Imperial
          oz: 'oz',
          ounce: 'oz',
          ounces: 'oz',
          lb: 'lb',
          lbs: 'lbs',
          pound: 'lb',
          pounds: 'lbs',

          // Weight - Metric
          g: 'g',
          gram: 'g',
          grams: 'g',
          kg: 'kg',
          kilogram: 'kg',
          kilograms: 'kg',

          // Small measurements
          tsp: 'tsp',
          teaspoon: 'tsp',
          teaspoons: 'tsp',
          tbsp: 'tbsp',
          tablespoon: 'tbsp',
          tablespoons: 'tbsp',
          dash: 'dash',
          pinch: 'pinch',
          drop: 'drop',
          drops: 'drops',

          // Count/pieces
          slice: 'slice',
          slices: 'slices',
          piece: 'piece',
          pieces: 'piece',
          whole: 'piece',
          each: 'piece',
          clove: 'clove',
          sprig: 'sprig',
          sprigs: 'sprigs',
          bulb: 'bulb',
          head: 'head',
          stalk: 'stalk',
          stalks: 'stalks',
          leaf: 'leaf',
          leaves: 'leaves',
          stick: 'stick',
          strip: 'strip',
          strips: 'strips',
          cob: 'cob',
          cobs: 'cobs',
          capsule: 'capsule',
          bar: 'bar',

          // Packaging
          package: 'package',
          sheet: 'sheet',
          'tea bag': 'tea bag',
          bag: 'bag',
          scoop: 'scoop',
          loaf: 'loaf',
          loaves: 'loaves',
          bundle: 'bundle',

          // Length
          meter: 'meter',
          meters: 'meters',
          metre: 'meter',
          metres: 'meters',
        };

        return unitMap[unitLower] || unit;
      },

      addItem: (item) => {
        set((state) => {
          // Use the units store for normalization
          const normalizedUnit = get().normalizeUnit(item.unit);

          // Check if item with same name and unit already exists
          const existingItemIndex = state.items.findIndex(
            (existingItem) =>
              existingItem.name.toLowerCase() === item.name.toLowerCase() &&
              get().normalizeUnit(existingItem.unit) === normalizedUnit
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
        return get()
          .items.filter((item) => !item.isChecked)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => {
            // Try to get the proper unit display name
            const unit = get().normalizeUnit(item.unit);
            const displayUnit = (item.amount === 1 || unit.endsWith('s')) ? unit : unit + 's';
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
