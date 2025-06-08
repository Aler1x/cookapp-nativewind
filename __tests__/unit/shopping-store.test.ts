import { renderHook, act } from '@testing-library/react-native';
import { useShoppingListStore } from '~/stores/shopping';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('useShoppingListStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useShoppingListStore.getState().clearAllItems();
    });
  });

  describe('normalizeUnit function', () => {
    it('normalizes volume units correctly', () => {
      const { result } = renderHook(() => useShoppingListStore());

      expect(result.current.normalizeUnit('cup')).toBe('cup');
      expect(result.current.normalizeUnit('c')).toBe('cup');
      expect(result.current.normalizeUnit('fl oz')).toBe('fl oz');
      expect(result.current.normalizeUnit('fluid ounce')).toBe('fl oz');
      expect(result.current.normalizeUnit('ml')).toBe('ml');
      expect(result.current.normalizeUnit('milliliter')).toBe('ml');
      expect(result.current.normalizeUnit('l')).toBe('l');
      expect(result.current.normalizeUnit('liter')).toBe('l');
    });

    it('normalizes weight units correctly', () => {
      const { result } = renderHook(() => useShoppingListStore());

      expect(result.current.normalizeUnit('oz')).toBe('oz');
      expect(result.current.normalizeUnit('ounce')).toBe('oz');
      expect(result.current.normalizeUnit('lb')).toBe('lb');
      expect(result.current.normalizeUnit('pound')).toBe('lb');
      expect(result.current.normalizeUnit('g')).toBe('g');
      expect(result.current.normalizeUnit('gram')).toBe('g');
      expect(result.current.normalizeUnit('kg')).toBe('kg');
      expect(result.current.normalizeUnit('kilogram')).toBe('kg');
    });

    it('normalizes small measurement units correctly', () => {
      const { result } = renderHook(() => useShoppingListStore());

      expect(result.current.normalizeUnit('tsp')).toBe('tsp');
      expect(result.current.normalizeUnit('teaspoon')).toBe('tsp');
      expect(result.current.normalizeUnit('tbsp')).toBe('tbsp');
      expect(result.current.normalizeUnit('tablespoon')).toBe('tbsp');
    });

    it('handles case insensitive input', () => {
      const { result } = renderHook(() => useShoppingListStore());

      expect(result.current.normalizeUnit('CUP')).toBe('cup');
      expect(result.current.normalizeUnit('Cup')).toBe('cup');
      expect(result.current.normalizeUnit('GRAM')).toBe('g');
    });

    it('returns original unit if not found in map', () => {
      const { result } = renderHook(() => useShoppingListStore());

      expect(result.current.normalizeUnit('unknown-unit')).toBe('unknown-unit');
    });
  });

  describe('addItem function', () => {
    it('adds new item to empty list', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]).toMatchObject({
        name: 'Apples',
        amount: 2,
        unit: 'piece',
        isChecked: false,
      });
      expect(result.current.items[0].id).toBeDefined();
    });

    it('merges amounts for items with same name and unit', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
        result.current.addItem({
          name: 'Apples',
          amount: 3,
          unit: 'piece',
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].amount).toBe(5);
    });

    it('creates separate items for same name but different units', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Milk',
          amount: 1,
          unit: 'l',
        });
        result.current.addItem({
          name: 'Milk',
          amount: 500,
          unit: 'ml',
        });
      });

      expect(result.current.items).toHaveLength(2);
    });

    it('normalizes units when adding items', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Sugar',
          amount: 1,
          unit: 'cup',
        });
        result.current.addItem({
          name: 'Sugar',
          amount: 1,
          unit: 'c', // Should be normalized to 'cup'
        });
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].amount).toBe(2);
      expect(result.current.items[0].unit).toBe('cup');
    });
  });

  describe('removeItem function', () => {
    it('removes item by id', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
      });

      const itemId = result.current.items[0].id;

      act(() => {
        result.current.removeItem(itemId);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('does not affect other items when removing', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
        result.current.addItem({
          name: 'Bananas',
          amount: 3,
          unit: 'piece',
        });
      });

      const firstItemId = result.current.items[0].id;

      act(() => {
        result.current.removeItem(firstItemId);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe('Bananas');
    });
  });

  describe('toggleItem function', () => {
    it('toggles item checked state', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
      });

      const itemId = result.current.items[0].id;
      expect(result.current.items[0].isChecked).toBe(false);

      act(() => {
        result.current.toggleItem(itemId);
      });

      expect(result.current.items[0].isChecked).toBe(true);

      act(() => {
        result.current.toggleItem(itemId);
      });

      expect(result.current.items[0].isChecked).toBe(false);
    });
  });

  describe('updateItemAmount function', () => {
    it('updates item amount', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
      });

      const itemId = result.current.items[0].id;

      act(() => {
        result.current.updateItemAmount(itemId, 5);
      });

      expect(result.current.items[0].amount).toBe(5);
    });
  });

  describe('clearCheckedItems function', () => {
    it('removes only checked items', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apples',
          amount: 2,
          unit: 'piece',
        });
        result.current.addItem({
          name: 'Bananas',
          amount: 3,
          unit: 'piece',
        });
      });

      const firstItemId = result.current.items[0].id;

      act(() => {
        result.current.toggleItem(firstItemId); // Check first item
        result.current.clearCheckedItems();
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe('Bananas');
    });
  });

  describe('getUncheckedItems and getCheckedItems functions', () => {
    it('returns correct filtered and sorted items', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Zebra',
          amount: 1,
          unit: 'piece',
        });
        result.current.addItem({
          name: 'Apple',
          amount: 2,
          unit: 'piece',
        });
      });

      const zebraId = result.current.items.find((item) => item.name === 'Zebra')?.id!;

      act(() => {
        result.current.toggleItem(zebraId); // Check Zebra
      });

      const unchecked = result.current.getUncheckedItems();
      const checked = result.current.getCheckedItems();

      expect(unchecked).toHaveLength(1);
      expect(unchecked[0].name).toBe('Apple');

      expect(checked).toHaveLength(1);
      expect(checked[0].name).toBe('Zebra');
    });
  });

  describe('formatShoppingListForSharing function', () => {
    it('formats unchecked items for sharing', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apple',
          amount: 2,
          unit: 'piece',
        });
        result.current.addItem({
          name: 'Milk',
          amount: 1,
          unit: 'l',
        });
      });

      const formatted = result.current.formatShoppingListForSharing();

      expect(formatted).toContain('2 pieces Apple');
      expect(formatted).toContain('1 l Milk');
    });

    it('excludes checked items from sharing format', () => {
      const { result } = renderHook(() => useShoppingListStore());

      act(() => {
        result.current.addItem({
          name: 'Apple',
          amount: 2,
          unit: 'piece',
        });
        result.current.addItem({
          name: 'Milk',
          amount: 1,
          unit: 'l',
        });
      });

      const appleId = result.current.items.find((item) => item.name === 'Apple')?.id!;

      act(() => {
        result.current.toggleItem(appleId); // Check Apple
      });

      const formatted = result.current.formatShoppingListForSharing();

      expect(formatted).not.toContain('Apple');
      expect(formatted).toContain('1 l Milk');
    });
  });
});
