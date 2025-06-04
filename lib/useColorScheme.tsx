import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  // TODO: Remove this once the color scheme is implemented
  // return {
  //   colorScheme: colorScheme ?? 'dark',
  //   isDarkColorScheme: colorScheme === 'dark',
  //   setColorScheme,
  //   toggleColorScheme,
  // };
  return {
    colorScheme: 'light',
    isDarkColorScheme: false,
    setColorScheme,
    toggleColorScheme,
  };
}
