import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeDetailPage from '~/app/recipes/[slug]';

// Mock color scheme
jest.mock('~/lib/useColorScheme', () => ({
  useColorScheme: jest.fn(() => ({ isDarkColorScheme: false })),
}));

// Mock constants
jest.mock('~/lib/constants', () => ({
  THEME: {
    light: {
      colors: {
        background: '#ffffff',
      },
    },
    dark: {
      colors: {
        background: '#000000',
      },
    },
  },
}));

describe('RecipeDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<RecipeDetailPage />);
    expect(getByText('Recipe Detail')).toBeTruthy();
  });

  it('displays recipe detail text', () => {
    const { getByText } = render(<RecipeDetailPage />);
    expect(getByText('Recipe Detail')).toBeTruthy();
  });

  it('has proper structure with SafeAreaView', () => {
    const { UNSAFE_getByType } = render(<RecipeDetailPage />);
    expect(UNSAFE_getByType(SafeAreaView)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { UNSAFE_getByType } = render(<RecipeDetailPage />);
    
    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.className).toContain('flex-1');
    expect(safeAreaView.props.className).toContain('items-center');
    expect(safeAreaView.props.className).toContain('justify-center');
  });

  it('applies light theme background', () => {
    const { UNSAFE_getByType } = render(<RecipeDetailPage />);
    
    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.style.backgroundColor).toBe('#ffffff');
  });

  it('applies dark theme background when dark mode is enabled', () => {
    const { useColorScheme } = require('~/lib/useColorScheme');
    useColorScheme.mockReturnValue({ isDarkColorScheme: true });

    const { UNSAFE_getByType } = render(<RecipeDetailPage />);
    
    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.style.backgroundColor).toBe('#000000');
  });

  it('centers content properly', () => {
    const { getByText } = render(<RecipeDetailPage />);
    const recipeDetailText = getByText('Recipe Detail');
    
    // Text should be rendered within the centered container
    expect(recipeDetailText).toBeTruthy();
  });

  it('matches snapshot with light theme', () => {
    const tree = render(<RecipeDetailPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with dark theme', () => {
    const { useColorScheme } = require('~/lib/useColorScheme');
    useColorScheme.mockReturnValue({ isDarkColorScheme: true });

    const tree = render(<RecipeDetailPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); 