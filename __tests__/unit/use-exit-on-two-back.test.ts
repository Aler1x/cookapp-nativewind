import { renderHook, act } from '@testing-library/react-native';
import { useExitOnTwoBack } from '~/hooks/useExitOnTwoBack';

// Mock dependencies - declare these first before using them in jest.mock
const mockSetParams = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemove = jest.fn();
const mockExitApp = jest.fn();
const mockToastShow = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    setParams: mockSetParams,
  }),
}));

jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: mockAddEventListener,
    exitApp: mockExitApp,
  },
}));

jest.mock('react-native-toast-message', () => ({
  show: mockToastShow,
}));

describe('useExitOnTwoBack Hook', () => {
  let backPressHandler: (() => boolean) | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Capture the back press handler
    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === 'hardwareBackPress') {
        backPressHandler = handler;
      }
      return { remove: mockRemove };
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    backPressHandler = null;
  });

  it('sets up back handler and router params on mount', () => {
    renderHook(() => useExitOnTwoBack());

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
    expect(mockSetParams).toHaveBeenCalledWith({ backBehavior: 'none' });
  });

  it('shows toast on first back press', () => {
    renderHook(() => useExitOnTwoBack());

    // Simulate first back press
    act(() => {
      const result = backPressHandler?.();
      expect(result).toBe(true);
    });

    expect(mockToastShow).toHaveBeenCalledWith({
      text1: 'Press back again to exit',
      position: 'bottom',
      visibilityTime: 2000,
    });
    expect(mockExitApp).not.toHaveBeenCalled();
  });

  it('exits app on second back press within timeout', () => {
    renderHook(() => useExitOnTwoBack());

    // First back press
    act(() => {
      backPressHandler?.();
    });

    // Second back press immediately
    act(() => {
      const result = backPressHandler?.();
      expect(result).toBe(true);
    });

    expect(mockExitApp).toHaveBeenCalled();
  });

  it('resets counter after timeout and shows toast again', () => {
    renderHook(() => useExitOnTwoBack());

    // First back press
    act(() => {
      backPressHandler?.();
    });

    // Wait for timeout
    act(() => {
      jest.advanceTimersByTime(2100);
    });

    // Another back press should show toast again
    act(() => {
      backPressHandler?.();
    });

    expect(mockToastShow).toHaveBeenCalledTimes(2);
    expect(mockExitApp).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useExitOnTwoBack());

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('clears timeout on unmount', () => {
    const { unmount } = renderHook(() => useExitOnTwoBack());

    // First back press to start timeout
    act(() => {
      backPressHandler?.();
    });

    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('prevents default back behavior by returning true', () => {
    renderHook(() => useExitOnTwoBack());

    const result1 = backPressHandler?.();
    const result2 = backPressHandler?.();

    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it('resets count when timeout expires', () => {
    renderHook(() => useExitOnTwoBack());

    // First back press
    act(() => {
      backPressHandler?.();
    });

    expect(mockToastShow).toHaveBeenCalledTimes(1);

    // Advance time to expire timeout
    act(() => {
      jest.advanceTimersByTime(2001);
    });

    // Third back press should show toast again (counter was reset)
    act(() => {
      backPressHandler?.();
    });

    expect(mockToastShow).toHaveBeenCalledTimes(2);
    expect(mockExitApp).not.toHaveBeenCalled();
  });

  it('clears previous timeout when new back press occurs', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    renderHook(() => useExitOnTwoBack());

    // First back press
    act(() => {
      backPressHandler?.();
    });

    // Wait a bit but not full timeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Second back press before timeout
    act(() => {
      backPressHandler?.();
    });

    // The timeout should have been cleared before setting a new one
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(mockExitApp).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('handles rapid back presses correctly', () => {
    renderHook(() => useExitOnTwoBack());

    // Rapid fire back presses
    act(() => {
      backPressHandler?.();
      backPressHandler?.();
    });

    expect(mockExitApp).toHaveBeenCalledTimes(1);
    expect(mockToastShow).toHaveBeenCalledTimes(1);
  });
}); 