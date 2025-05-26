const fonts = {
  regular: {
    fontFamily: 'Inter_400Regular',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'Inter_500Medium',
    fontWeight: '500' as const,
  },
  bold: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700' as const,
  },
  heavy: {
    fontFamily: 'Inter_900Black',
    fontWeight: '800' as const,
  },
};

export const NAV_THEME = {
  light: {
    dark: false,
    colors: {
      background: 'hsl(26 37% 96%)', // --background
      foreground: 'hsl(240 10% 3.9%)', // --foreground
      border: 'hsl(240 5.9% 90%)', // --border
      card: 'hsl(0 0% 100%)', // --card
      notification: 'hsl(0 84.2% 60.2%)', // --destructive
      primary: 'hsl(14 78% 66%)', // --primary
      text: 'hsl(240 10% 3.9%)', // --foreground
    },
    fonts: fonts,
  },
  dark: {
    dark: true,
    colors: {
      background: 'hsl(23, 40%, 4%)', // --background (dark)
      foreground: 'hsl(240, 10%, 96%)', // --foreground (dark)
      border: 'hsl(240 3.7% 15.9%)', // --border (dark)
      card: 'hsl(23, 40%, 4%)', // --card (dark)
      notification: 'hsl(0 72% 51%)', // --destructive (dark)
      primary: 'hsl(14 78% 34%)', // --primary (dark)
      text: 'hsl(240, 10%, 96%)', // --foreground (dark)
    },
    fonts: fonts,
  },
};
