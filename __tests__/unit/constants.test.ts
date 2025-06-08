import { THEME, API_ENDPOINTS_PREFIX } from '~/lib/constants';

describe('Constants', () => {
  describe('THEME', () => {
    it('has light and dark theme objects', () => {
      expect(THEME).toHaveProperty('light');
      expect(THEME).toHaveProperty('dark');
    });

    it('light theme has correct structure', () => {
      expect(THEME.light).toEqual(
        expect.objectContaining({
          dark: false,
          colors: expect.objectContaining({
            background: expect.any(String),
            foreground: expect.any(String),
            border: expect.any(String),
            card: expect.any(String),
            notification: expect.any(String),
            primary: expect.any(String),
            text: expect.any(String),
          }),
          fonts: expect.objectContaining({
            regular: expect.objectContaining({
              fontFamily: 'Comfortaa_400Regular',
              fontWeight: '400',
            }),
            medium: expect.objectContaining({
              fontFamily: 'Comfortaa_500Medium',
              fontWeight: '500',
            }),
            bold: expect.objectContaining({
              fontFamily: 'Comfortaa_700Bold',
              fontWeight: '700',
            }),
            heavy: expect.objectContaining({
              fontFamily: 'Comfortaa_900Black',
              fontWeight: '800',
            }),
          }),
        })
      );
    });

    it('dark theme has correct structure', () => {
      expect(THEME.dark).toEqual(
        expect.objectContaining({
          dark: true,
          colors: expect.objectContaining({
            background: expect.any(String),
            foreground: expect.any(String),
            border: expect.any(String),
            card: expect.any(String),
            notification: expect.any(String),
            primary: expect.any(String),
            text: expect.any(String),
          }),
          fonts: expect.objectContaining({
            regular: expect.objectContaining({
              fontFamily: 'Comfortaa_400Regular',
              fontWeight: '400',
            }),
            medium: expect.objectContaining({
              fontFamily: 'Comfortaa_500Medium',
              fontWeight: '500',
            }),
            bold: expect.objectContaining({
              fontFamily: 'Comfortaa_700Bold',
              fontWeight: '700',
            }),
            heavy: expect.objectContaining({
              fontFamily: 'Comfortaa_900Black',
              fontWeight: '800',
            }),
          }),
        })
      );
    });

    it('light and dark themes have different colors', () => {
      expect(THEME.light.colors.background).not.toBe(THEME.dark.colors.background);
      expect(THEME.light.colors.foreground).not.toBe(THEME.dark.colors.foreground);
      expect(THEME.light.colors.primary).not.toBe(THEME.dark.colors.primary);
    });

    it('both themes use same font families', () => {
      expect(THEME.light.fonts).toEqual(THEME.dark.fonts);
    });

    it('uses HSL color format for all colors', () => {
      const hslRegex = /^hsl\(/;

      Object.values(THEME.light.colors).forEach((color) => {
        expect(color).toMatch(hslRegex);
      });

      Object.values(THEME.dark.colors).forEach((color) => {
        expect(color).toMatch(hslRegex);
      });
    });

    it('has all required Comfortaa font weights', () => {
      const expectedFonts = ['regular', 'medium', 'bold', 'heavy'];

      expectedFonts.forEach((weight) => {
        expect(THEME.light.fonts).toHaveProperty(weight);
        expect(THEME.dark.fonts).toHaveProperty(weight);
      });
    });
  });

  describe('API_ENDPOINTS_PREFIX', () => {
    it('has all required API endpoint prefixes', () => {
      expect(API_ENDPOINTS_PREFIX).toEqual({
        spring: '/api',
        node: '/personalization',
        python: '/chatbot',
      });
    });

    it('all prefixes start with forward slash', () => {
      Object.values(API_ENDPOINTS_PREFIX).forEach((prefix) => {
        expect(prefix).toMatch(/^\//);
      });
    });

    it('has spring endpoint for CRUD operations', () => {
      expect(API_ENDPOINTS_PREFIX.spring).toBe('/api');
    });

    it('has node endpoint for personalization', () => {
      expect(API_ENDPOINTS_PREFIX.node).toBe('/personalization');
    });

    it('has python endpoint for chatbot', () => {
      expect(API_ENDPOINTS_PREFIX.python).toBe('/chatbot');
    });
  });

  describe('Color values', () => {
    it('light theme has warm background color', () => {
      expect(THEME.light.colors.background).toBe('hsl(26 37% 96%)');
    });

    it('dark theme has dark brown background', () => {
      expect(THEME.dark.colors.background).toBe('hsl(23, 40%, 4%)');
    });

    it('primary color is orange-based for both themes', () => {
      expect(THEME.light.colors.primary).toBe('hsl(14 78% 66%)');
      expect(THEME.dark.colors.primary).toBe('hsl(14 78% 34%)');
    });
  });
});
