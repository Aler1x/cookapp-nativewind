import { renderHook } from '@testing-library/react-native';
import { useShoppingListStore } from '~/stores/shopping';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('normalizeUnit function', () => {
  it('normalizes volume units correctly', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    // Cup variations
    expect(result.current.normalizeUnit('cup')).toBe('cup');
    expect(result.current.normalizeUnit('c')).toBe('cup');
    expect(result.current.normalizeUnit('Cup')).toBe('cup');
    expect(result.current.normalizeUnit('CUP')).toBe('cup');
    
    // Fluid ounce variations
    expect(result.current.normalizeUnit('fl oz')).toBe('fl oz');
    expect(result.current.normalizeUnit('fluid ounce')).toBe('fl oz');
    expect(result.current.normalizeUnit('fluid ounces')).toBe('fl oz');
    
    // Milliliter variations
    expect(result.current.normalizeUnit('ml')).toBe('ml');
    expect(result.current.normalizeUnit('milliliter')).toBe('ml');
    expect(result.current.normalizeUnit('milliliters')).toBe('ml');
    expect(result.current.normalizeUnit('ML')).toBe('ml');
    
    // Liter variations
    expect(result.current.normalizeUnit('l')).toBe('l');
    expect(result.current.normalizeUnit('liter')).toBe('l');
    expect(result.current.normalizeUnit('liters')).toBe('l');
    expect(result.current.normalizeUnit('litre')).toBe('l');
    expect(result.current.normalizeUnit('litres')).toBe('l');
    
    // Other volume units
    expect(result.current.normalizeUnit('quart')).toBe('quart');
    expect(result.current.normalizeUnit('pint')).toBe('pint');
    expect(result.current.normalizeUnit('gallon')).toBe('gallon');
  });

  it('normalizes weight units correctly', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    // Ounce variations
    expect(result.current.normalizeUnit('oz')).toBe('oz');
    expect(result.current.normalizeUnit('ounce')).toBe('oz');
    expect(result.current.normalizeUnit('ounces')).toBe('oz');
    expect(result.current.normalizeUnit('OZ')).toBe('oz');
    
    // Pound variations
    expect(result.current.normalizeUnit('lb')).toBe('lb');
    expect(result.current.normalizeUnit('lbs')).toBe('lbs');
    expect(result.current.normalizeUnit('pound')).toBe('lb');
    expect(result.current.normalizeUnit('pounds')).toBe('lbs');
    
    // Gram variations
    expect(result.current.normalizeUnit('g')).toBe('g');
    expect(result.current.normalizeUnit('gram')).toBe('g');
    expect(result.current.normalizeUnit('grams')).toBe('g');
    expect(result.current.normalizeUnit('G')).toBe('g');
    
    // Kilogram variations
    expect(result.current.normalizeUnit('kg')).toBe('kg');
    expect(result.current.normalizeUnit('kilogram')).toBe('kg');
    expect(result.current.normalizeUnit('kilograms')).toBe('kg');
    expect(result.current.normalizeUnit('KG')).toBe('kg');
  });

  it('normalizes small measurement units correctly', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    // Teaspoon variations
    expect(result.current.normalizeUnit('tsp')).toBe('tsp');
    expect(result.current.normalizeUnit('teaspoon')).toBe('tsp');
    expect(result.current.normalizeUnit('teaspoons')).toBe('tsp');
    expect(result.current.normalizeUnit('TSP')).toBe('tsp');
    
    // Tablespoon variations
    expect(result.current.normalizeUnit('tbsp')).toBe('tbsp');
    expect(result.current.normalizeUnit('tablespoon')).toBe('tbsp');
    expect(result.current.normalizeUnit('tablespoons')).toBe('tbsp');
    expect(result.current.normalizeUnit('TBSP')).toBe('tbsp');
    
    // Small units
    expect(result.current.normalizeUnit('dash')).toBe('dash');
    expect(result.current.normalizeUnit('pinch')).toBe('pinch');
    expect(result.current.normalizeUnit('drop')).toBe('drop');
    expect(result.current.normalizeUnit('drops')).toBe('drops');
  });

  it('normalizes count/piece units correctly', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    // Piece variations
    expect(result.current.normalizeUnit('piece')).toBe('piece');
    expect(result.current.normalizeUnit('pieces')).toBe('piece');
    expect(result.current.normalizeUnit('whole')).toBe('piece');
    expect(result.current.normalizeUnit('each')).toBe('piece');
    
    // Slice variations
    expect(result.current.normalizeUnit('slice')).toBe('slice');
    expect(result.current.normalizeUnit('slices')).toBe('slices');
    
    // Other count units
    expect(result.current.normalizeUnit('clove')).toBe('clove');
    expect(result.current.normalizeUnit('sprig')).toBe('sprig');
    expect(result.current.normalizeUnit('sprigs')).toBe('sprigs');
    expect(result.current.normalizeUnit('bulb')).toBe('bulb');
    expect(result.current.normalizeUnit('head')).toBe('head');
    expect(result.current.normalizeUnit('stalk')).toBe('stalk');
    expect(result.current.normalizeUnit('stalks')).toBe('stalks');
    expect(result.current.normalizeUnit('leaf')).toBe('leaf');
    expect(result.current.normalizeUnit('leaves')).toBe('leaves');
  });

  it('normalizes packaging units correctly', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit('package')).toBe('package');
    expect(result.current.normalizeUnit('sheet')).toBe('sheet');
    expect(result.current.normalizeUnit('tea bag')).toBe('tea bag');
    expect(result.current.normalizeUnit('bag')).toBe('bag');
    expect(result.current.normalizeUnit('scoop')).toBe('scoop');
    expect(result.current.normalizeUnit('loaf')).toBe('loaf');
    expect(result.current.normalizeUnit('loaves')).toBe('loaves');
    expect(result.current.normalizeUnit('bundle')).toBe('bundle');
  });

  it('normalizes length units correctly', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit('meter')).toBe('meter');
    expect(result.current.normalizeUnit('meters')).toBe('meters');
    expect(result.current.normalizeUnit('metre')).toBe('meter');
    expect(result.current.normalizeUnit('metres')).toBe('meters');
  });

  it('handles case insensitive input', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit('CUP')).toBe('cup');
    expect(result.current.normalizeUnit('Cup')).toBe('cup');
    expect(result.current.normalizeUnit('cUp')).toBe('cup');
    expect(result.current.normalizeUnit('GRAM')).toBe('g');
    expect(result.current.normalizeUnit('Gram')).toBe('g');
    expect(result.current.normalizeUnit('gRaM')).toBe('g');
    expect(result.current.normalizeUnit('TEASPOON')).toBe('tsp');
    expect(result.current.normalizeUnit('TeAsPoOn')).toBe('tsp');
  });

  it('handles whitespace in input', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit(' cup ')).toBe('cup');
    expect(result.current.normalizeUnit('  gram  ')).toBe('g');
    expect(result.current.normalizeUnit('\tcup\t')).toBe('cup');
    expect(result.current.normalizeUnit('\nteaspoon\n')).toBe('tsp');
  });

  it('returns original unit if not found in map', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit('unknown-unit')).toBe('unknown-unit');
    expect(result.current.normalizeUnit('custom-measure')).toBe('custom-measure');
    expect(result.current.normalizeUnit('xyz')).toBe('xyz');
    expect(result.current.normalizeUnit('123')).toBe('123');
  });

  it('handles empty and null inputs', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit('')).toBe('');
    expect(result.current.normalizeUnit('   ')).toBe('');
  });

  it('handles special characters in unit names', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    expect(result.current.normalizeUnit('fl oz')).toBe('fl oz'); // space in unit name
    expect(result.current.normalizeUnit('tea bag')).toBe('tea bag'); // space in unit name
  });

  it('normalizes consistently across multiple calls', () => {
    const { result } = renderHook(() => useShoppingListStore());
    
    // Multiple calls should return same result
    expect(result.current.normalizeUnit('cup')).toBe('cup');
    expect(result.current.normalizeUnit('cup')).toBe('cup');
    expect(result.current.normalizeUnit('CUP')).toBe('cup');
    expect(result.current.normalizeUnit('c')).toBe('cup');
    
    // All should normalize to the same value
    const cupVariations = ['cup', 'CUP', 'Cup', 'c', 'C'];
    const normalizedValues = cupVariations.map(unit => result.current.normalizeUnit(unit));
    const uniqueValues = [...new Set(normalizedValues)];
    
    expect(uniqueValues).toHaveLength(1);
    expect(uniqueValues[0]).toBe('cup');
  });
}); 