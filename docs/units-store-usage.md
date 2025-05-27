# Units Store Usage Guide

The units store provides a centralized way to manage cooking units (like cups, grams, tablespoons, etc.) across your app with automatic caching and persistence.

## Features

- **Automatic Caching**: Units are cached for 24 hours to reduce API calls
- **Persistence**: Units are stored locally using AsyncStorage
- **Smart Prefetching**: Only fetches when needed (no data or stale data)
- **Multiple Getters**: Get units by ID, name, type, or get all units
- **Error Handling**: Comprehensive error handling with retry capability
- **TypeScript Support**: Fully typed with proper interfaces

## Basic Usage

### 1. App Initialization (Prefetching)

Add this to your app's root component or main layout to prefetch units on app start:

```tsx
// app/_layout.tsx or app/(tabs)/_layout.tsx
import { useEffect } from 'react';
import { useUnits } from '~/stores/units';

export default function RootLayout() {
  const { prefetchIfNeeded } = useUnits();

  useEffect(() => {
    // Prefetch units when app starts
    prefetchIfNeeded().catch(console.error);
  }, [prefetchIfNeeded]);

  return (
    // Your layout JSX
  );
}
```

### 2. Using Units in Components

#### Get All Units (for dropdowns, lists)

```tsx
import { useUnits, useUnitGetters } from '~/stores/units';

function UnitSelector() {
  const { units, isLoading, error } = useUnits();
  const { getAllUnits } = useUnitGetters();

  if (isLoading) return <Text>Loading units...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <Select>
      {getAllUnits().map((unit) => (
        <SelectItem key={unit.id} value={unit.id}>
          {unit.name.one}
        </SelectItem>
      ))}
    </Select>
  );
}
```

#### Get Unit by ID (for displaying recipe ingredients)

```tsx
import { useUnitGetters } from '~/stores/units';

function IngredientDisplay({ ingredient }) {
  const { getUnitById } = useUnitGetters();
  const unit = getUnitById(ingredient.measurements.unit.id);

  return (
    <Text>
      {ingredient.measurements.amount} {unit?.name.one || 'unit'} {ingredient.name}
    </Text>
  );
}
```

#### Get Unit by Name (for shopping list merging)

```tsx
import { useUnitGetters } from '~/stores/units';

function ShoppingListMerger() {
  const { normalizeUnit } = useUnitGetters();

  // Use the built-in normalization function
  const mergedItems = items.reduce((acc, item) => {
    const normalizedUnit = normalizeUnit(item.unit);
    // ... merging logic
  }, []);
}
```

#### Get Units by Type (for categorized displays)

```tsx
import { useUnitGetters } from '~/stores/units';

function UnitsByCategory() {
  const { getUnitsByType } = useUnitGetters();

  const volumeUnits = getUnitsByType('volume');
  const weightUnits = getUnitsByType('weight');

  return (
    <View>
      <Text>Volume Units:</Text>
      {volumeUnits.map((unit) => (
        <Text key={unit.id}>{unit.name.one}</Text>
      ))}

      <Text>Weight Units:</Text>
      {weightUnits.map((unit) => (
        <Text key={unit.id}>{unit.name.one}</Text>
      ))}
    </View>
  );
}
```

#### Normalize Units (for consistent unit handling)

```tsx
import { useUnitGetters } from '~/stores/units';

function UnitNormalization() {
  const { normalizeUnit } = useUnitGetters();

  // Normalize various unit spellings to canonical form
  const normalized1 = normalizeUnit('cup'); // 'cup'
  const normalized2 = normalizeUnit('c'); // 'cup'
  const normalized3 = normalizeUnit('Cup'); // 'cup'
  const normalized4 = normalizeUnit('cups'); // 'cup'
  const normalized5 = normalizeUnit('grams'); // 'g' (if 'g' is the canonical form)

  // Use for shopping list merging, recipe conversion, etc.
  const mergeItems = (items) => {
    return items.reduce((acc, item) => {
      const normalizedUnit = normalizeUnit(item.unit);
      // ... merging logic using normalized unit
    }, []);
  };
}
```

### 3. Manual Fetching (if needed)

```tsx
import { useUnits } from '~/stores/units';

function RefreshButton() {
  const { fetchUnits, isLoading } = useUnits();

  const handleRefresh = async () => {
    try {
      await fetchUnits();
      // Success feedback
    } catch (error) {
      // Error handling
    }
  };

  return (
    <Button onPress={handleRefresh} disabled={isLoading}>
      {isLoading ? 'Refreshing...' : 'Refresh Units'}
    </Button>
  );
}
```

## Integration Examples

### Shopping List Integration

```tsx
// stores/shopping-list.ts - Update your existing store
import { useUnitsStore } from './units';

// In your shopping list store, use the units store for normalization
const addItem = (item) => {
  const unitsState = useUnitsStore.getState();
  const normalizedUnit = unitsState.normalizeUnit(item.unit);

  // ... rest of your add item logic
};
```

### Recipe Creation Form

```tsx
import { useUnits, useUnitGetters } from '~/stores/units';

function RecipeForm() {
  const { units, isLoading } = useUnits();
  const { getUnitsByType } = useUnitGetters();

  const volumeUnits = getUnitsByType('volume');
  const weightUnits = getUnitsByType('weight');

  return (
    <Form>
      {/* Ingredient inputs */}
      <Select placeholder='Select unit'>
        <SelectGroup label='Volume'>
          {volumeUnits.map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              {unit.name.one}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup label='Weight'>
          {weightUnits.map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              {unit.name.one}
            </SelectItem>
          ))}
        </SelectGroup>
      </Select>
    </Form>
  );
}
```

## API Endpoint

The store expects your backend to have a `/units` endpoint that returns:

```json
[
  {
    "id": "unit-1",
    "name": {
      "one": "cup",
      "many": "cups"
    },
    "type": "volume"
  },
  {
    "id": "unit-2",
    "name": {
      "one": "gram",
      "many": "grams"
    },
    "type": "weight"
  }
]
```

Or wrapped in a data object:

```json
{
  "data": [
    /* units array */
  ],
  "meta": {
    /* optional metadata */
  }
}
```

## Environment Setup

Make sure your `.env` file has the API endpoint configured:

```env
EXPO_PUBLIC_API_ENDPOINT=https://your-api-domain.com/api
```

## Best Practices

1. **Prefetch Early**: Call `prefetchIfNeeded()` in your app's root layout
2. **Use Getters**: Use the getter functions instead of directly accessing the units array
3. **Handle Loading States**: Always check `isLoading` when displaying units
4. **Error Handling**: Implement proper error handling for network failures
5. **Type Safety**: Use the exported `Unit` type for type safety

## Performance Notes

- Units are cached for 24 hours to minimize API calls
- Only essential data is persisted to AsyncStorage
- Getters return new arrays/objects to prevent accidental mutations
- Multiple simultaneous fetch requests are prevented
