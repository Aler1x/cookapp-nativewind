import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useColorScheme } from '~/lib/useColorScheme';

// Mock nativewind
const mockSetColorScheme = jest.fn();
const mockToggleColorScheme = jest.fn();
let mockColorScheme: 'light' | 'dark' | null = 'dark';

jest.mock('nativewind', () => ({
  useColorScheme: () => ({
    colorScheme: mockColorScheme,
    setColorScheme: mockSetColorScheme,
    toggleColorScheme: mockToggleColorScheme,
  }),
}));

describe('useColorScheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockColorScheme = 'dark';
  });

  it('returns dark color scheme by default', () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.colorScheme).toBe('dark');
    expect(result.current.isDarkColorScheme).toBe(true);
  });

  it('returns light color scheme when nativewind returns light', () => {
    mockColorScheme = 'light';

    const { result } = renderHook(() => useColorScheme());

    expect(result.current.colorScheme).toBe('light');
    expect(result.current.isDarkColorScheme).toBe(false);
  });

  it('defaults to dark when nativewind returns null', () => {
    mockColorScheme = null;

    const { result } = renderHook(() => useColorScheme());

    expect(result.current.colorScheme).toBe('dark');
    expect(result.current.isDarkColorScheme).toBe(true);
  });

  it('provides setColorScheme function', () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.setColorScheme).toBe(mockSetColorScheme);
  });

  it('provides toggleColorScheme function', () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.toggleColorScheme).toBe(mockToggleColorScheme);
  });

  it('setColorScheme calls nativewind setColorScheme', () => {
    const { result } = renderHook(() => useColorScheme());

    act(() => {
      result.current.setColorScheme('light');
    });

    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
  });

  it('toggleColorScheme calls nativewind toggleColorScheme', () => {
    const { result } = renderHook(() => useColorScheme());

    act(() => {
      result.current.toggleColorScheme();
    });

    expect(mockToggleColorScheme).toHaveBeenCalled();
  });

  it('returns consistent object structure', () => {
    const { result } = renderHook(() => useColorScheme());

    expect(result.current).toEqual({
      colorScheme: expect.any(String),
      isDarkColorScheme: expect.any(Boolean),
      setColorScheme: expect.any(Function),
      toggleColorScheme: expect.any(Function),
    });
  });

  it('isDarkColorScheme is false when colorScheme is light', () => {
    mockColorScheme = 'light';

    const { result } = renderHook(() => useColorScheme());

    expect(result.current.isDarkColorScheme).toBe(false);
  });

  it('isDarkColorScheme is true when colorScheme is dark', () => {
    mockColorScheme = 'dark';

    const { result } = renderHook(() => useColorScheme());

    expect(result.current.isDarkColorScheme).toBe(true);
  });

  it('reacts to colorScheme changes', () => {
    const { result, rerender } = renderHook(() => useColorScheme());

    // Initially dark
    expect(result.current.colorScheme).toBe('dark');
    expect(result.current.isDarkColorScheme).toBe(true);

    // Change to light
    mockColorScheme = 'light';
    rerender(null);

    expect(result.current.colorScheme).toBe('light');
    expect(result.current.isDarkColorScheme).toBe(false);
  });
});
