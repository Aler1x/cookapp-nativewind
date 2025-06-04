import { cn } from '~/lib/utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toBe('base conditional');
    });

    it('handles array of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('handles object with boolean values', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'primary': true,
      });
      expect(result).toBe('active primary');
    });

    it('merges Tailwind classes correctly (no duplicates)', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2'); // Later class should override
    });

    it('handles empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles null and undefined values', () => {
      const result = cn('valid', null, undefined, 'another');
      expect(result).toBe('valid another');
    });

    it('handles complex Tailwind class merging', () => {
      const result = cn('bg-red-500', 'bg-blue-500', 'text-white');
      expect(result).toBe('bg-blue-500 text-white');
    });

    it('handles mixed input types', () => {
      const result = cn(
        'base',
        ['array1', 'array2'],
        { conditional: true, hidden: false },
        'final'
      );
      expect(result).toBe('base array1 array2 conditional final');
    });

    it('preserves important classes', () => {
      const result = cn('!important-class', 'normal-class');
      expect(result).toBe('!important-class normal-class');
    });

    it('handles responsive Tailwind classes', () => {
      const result = cn('sm:p-4', 'md:p-6', 'lg:p-8');
      expect(result).toBe('sm:p-4 md:p-6 lg:p-8');
    });

    it('handles hover and focus states', () => {
      const result = cn('hover:bg-blue-500', 'focus:bg-green-500', 'active:bg-red-500');
      expect(result).toBe('hover:bg-blue-500 focus:bg-green-500 active:bg-red-500');
    });

    it('merges conflicting margin classes', () => {
      const result = cn('m-4', 'mx-2', 'ml-1');
      expect(result).toBe('m-4 mx-2 ml-1'); // Should preserve the specificity order
    });

    it('handles dark mode classes', () => {
      const result = cn('bg-white', 'dark:bg-black', 'text-black', 'dark:text-white');
      expect(result).toBe('bg-white dark:bg-black text-black dark:text-white');
    });
  });
}); 