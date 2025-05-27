# Unit Selector with Proper Plural/Singular Forms

This example shows how the enhanced shopping list uses the units store to provide a proper unit selector with automatic plural/singular form handling.

## Features

- **Categorized Units**: Units are grouped by type (Volume, Weight, Count, etc.)
- **Smart Display**: Shows singular form in selector, but uses correct plural/singular in display
- **Fallback Support**: Falls back to text input if units aren't loaded
- **Normalization**: Automatically normalizes unit names for consistent storage

## Implementation

### Unit Selector Component

```tsx
// In the shopping list modal
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
            <SelectItem key={unit.id} value={unit.id}>
              <Text>{unit.name.one}</Text> {/* Always show singular */}
            </SelectItem>
          ))}
        </SelectGroup>

        {/* Weight Units */}
        <SelectGroup>
          <SelectLabel>Weight</SelectLabel>
          {getUnitsByType('weight').map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              <Text>{unit.name.one}</Text> {/* Always show singular */}
            </SelectItem>
          ))}
        </SelectGroup>

        {/* Count/Piece Units */}
        <SelectGroup>
          <SelectLabel>Count</SelectLabel>
          {getUnitsByType('count').map((unit) => (
            <SelectItem key={unit.id} value={unit.id}>
              <Text>{unit.name.one}</Text> {/* Always show singular */}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ) : (
    <Input
      placeholder={unitsLoading ? 'Loading units...' : 'Enter unit (e.g., cups, lbs, pieces)'}
      value={newItemUnit}
      onChangeText={setNewItemUnit}
      editable={!unitsLoading}
    />
  )}
</View>
```

### Smart Display Logic

```tsx
// Helper function to get the correct unit display form
const getUnitDisplayName = (unitId: string, amount: number) => {
  const unit = getUnitById(unitId);
  if (!unit) return unitId;

  return amount === 1 ? unit.name.one : unit.name.many;
};

// Helper function to get unit display for items (handles both ID and name)
const getItemUnitDisplay = (item: any) => {
  // If the unit is already normalized (string), try to find the unit object
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
```

### Usage in Shopping List Items

```tsx
{
  /* Display with correct plural/singular form */
}
<Text className='text-gray-600 ml-2'>
  {item.amount} {getItemUnitDisplay(item)}
</Text>;
```

## Examples of Proper Form Usage

### Input vs Display

| Amount | Unit Selected | Stored As | Displayed As |
| ------ | ------------- | --------- | ------------ |
| 1      | "cup"         | "cup"     | "1 cup"      |
| 2      | "cup"         | "cup"     | "2 cups"     |
| 1      | "gram"        | "g"       | "1 g"        |
| 500    | "gram"        | "g"       | "500 g"      |
| 1      | "piece"       | "piece"   | "1 piece"    |
| 3      | "piece"       | "piece"   | "3 pieces"   |

### Unit Categories

The selector organizes units into logical groups:

- **Volume**: cup, ml, l, fl oz, pint, quart, gallon
- **Weight**: g, kg, oz, lb, lbs
- **Count**: piece, slice, clove, head, bunch
- **Other**: Any units that don't fit the above categories

## Benefits

1. **User-Friendly**: Easy to select from categorized list
2. **Consistent**: Always stores units in canonical form
3. **Grammatically Correct**: Displays proper plural/singular forms
4. **Flexible**: Falls back to text input if needed
5. **Smart Merging**: Items with same unit (different spellings) merge correctly

## Backend Integration

The selector expects your backend `/units` endpoint to return units with this structure:

```json
[
  {
    "id": "unit-cup",
    "name": {
      "one": "cup",
      "many": "cups"
    },
    "type": "volume"
  },
  {
    "id": "unit-gram",
    "name": {
      "one": "g",
      "many": "g"
    },
    "type": "weight"
  },
  {
    "id": "unit-piece",
    "name": {
      "one": "piece",
      "many": "pieces"
    },
    "type": "count"
  }
]
```

## Error Handling

- **Loading State**: Shows "Loading units..." while fetching
- **No Units**: Falls back to text input
- **Network Error**: Gracefully handles failed requests
- **Invalid Selection**: Normalizes any manually entered text
