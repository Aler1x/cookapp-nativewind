import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Unit } from '~/types/recipe';

interface UnitsState {
  // State
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchUnits: () => Promise<void>;
  setUnits: (units: Unit[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Getters
  getUnitById: (id: string) => Unit | undefined;
  getUnitsByIds: (ids: string[]) => Unit[];
  getUnitByName: (name: string) => Unit | undefined;
  getUnitsByType: (type: string) => Unit[];
  getAllUnits: () => Unit[];
  normalizeUnit: (unit: string) => string;

  // Utility methods
  shouldRefetch: () => boolean;
  prefetchIfNeeded: () => Promise<void>;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useUnitsStore = create<UnitsState>()(
  persist(
    (set, get) => ({
      // Initial state
      units: [],
      isLoading: false,
      error: null,
      lastFetched: null,

      // Actions
      fetchUnits: async () => {
        const state = get();

        // Prevent multiple simultaneous fetches
        if (state.isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const baseUrl = process.env.EXPO_PUBLIC_API_ENDPOINT || '';
          const response = await fetch(`${baseUrl}/units`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch units: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          // Handle different response formats
          const units = Array.isArray(data) ? data : data.data || [];

          set({
            units,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch units';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      setUnits: (units) => set({ units }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      // Getters
      getUnitById: (id: string) => {
        const { units } = get();
        return units.find((unit) => unit.id === id);
      },

      getUnitsByIds: (ids: string[]) => {
        const { units } = get();
        return units.filter((unit) => ids.includes(unit.id));
      },

      getUnitByName: (name: string) => {
        const { units } = get();
        const normalizedName = name.toLowerCase().trim();

        return units.find(
          (unit) => unit.name.one.toLowerCase() === normalizedName || unit.name.many.toLowerCase() === normalizedName
        );
      },

      // Enhanced unit normalization with fallback mapping
      normalizeUnit: (unit: string): string => {
        const { getUnitByName } = get();

        // First try to find the unit in the store
        const foundUnit = getUnitByName(unit);
        if (foundUnit) {
          return foundUnit.name.one; // Use the canonical "one" form
        }

        // Fallback to hardcoded mapping for backwards compatibility
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

      getUnitsByType: (type: string) => {
        const { units } = get();
        return units.filter((unit) => unit.type === type);
      },

      getAllUnits: () => {
        const { units } = get();
        return [...units]; // Return a copy to prevent mutations
      },

      // Utility methods
      shouldRefetch: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;

        const now = Date.now();
        return now - lastFetched > CACHE_DURATION;
      },

      prefetchIfNeeded: async () => {
        const state = get();

        // Only fetch if we don't have data or it's stale
        if (state.units.length === 0 || state.shouldRefetch()) {
          await state.fetchUnits();
        }
      },
    }),
    {
      name: 'units-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the units data and lastFetched timestamp
      partialize: (state) => ({
        units: state.units,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Export convenience hooks for common use cases
export const useUnits = () => {
  const store = useUnitsStore();
  return {
    units: store.units,
    isLoading: store.isLoading,
    error: store.error,
    fetchUnits: store.fetchUnits,
    prefetchIfNeeded: store.prefetchIfNeeded,
  };
};

export const useUnitGetters = () => {
  const store = useUnitsStore();
  return {
    getUnitById: store.getUnitById,
    getUnitsByIds: store.getUnitsByIds,
    getUnitByName: store.getUnitByName,
    getUnitsByType: store.getUnitsByType,
    getAllUnits: store.getAllUnits,
    normalizeUnit: store.normalizeUnit,
  };
};

// Export the Unit type for use in other files
export type { Unit };
