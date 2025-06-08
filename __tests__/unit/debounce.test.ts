import { debounce } from '~/lib/debounce';

describe('debounce function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('delays function execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('cancels previous calls when called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on each call', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    jest.advanceTimersByTime(500);

    debouncedFn(); // This should reset the timer
    jest.advanceTimersByTime(500);

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the debounced function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn('arg1', 'arg2', 123);
    jest.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('uses the latest arguments when called multiple times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('third');
  });

  it('works with different wait times', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 500);

    debouncedFn();
    jest.advanceTimersByTime(499);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('handles zero wait time', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('can be called multiple times after execution', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    // First execution
    debouncedFn('first');
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledWith('first');

    // Second execution
    debouncedFn('second');
    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledWith('second');

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('handles functions that throw errors', () => {
    const mockFn = jest.fn(() => {
      throw new Error('Test error');
    });
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();

    expect(() => {
      jest.advanceTimersByTime(1000);
    }).toThrow('Test error');

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('preserves function context when called with different this values', () => {
    const mockFn = jest.fn(function (this: any) {
      return this;
    });
    const debouncedFn = debounce(mockFn, 1000);

    const context = { name: 'test' };
    debouncedFn.call(context);

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('works with async functions', () => {
    const mockAsyncFn = jest.fn(async () => {
      return 'async result';
    });
    const debouncedFn = debounce(mockAsyncFn, 1000);

    debouncedFn();
    jest.advanceTimersByTime(1000);

    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
  });

  it('handles rapid successive calls correctly', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    // Rapid calls
    for (let i = 0; i < 10; i++) {
      debouncedFn(i);
      jest.advanceTimersByTime(50);
    }

    // Should not have been called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Wait for the full debounce period from the last call
    jest.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(9); // Last argument
  });

  it('clears timeout properly', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    debouncedFn();
    debouncedFn(); // This should clear the previous timeout

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('works with no arguments', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1000);

    debouncedFn();
    jest.advanceTimersByTime(1000);

    expect(mockFn).toHaveBeenCalledWith();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('maintains separate timers for different debounced functions', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const debouncedFn1 = debounce(mockFn1, 1000);
    const debouncedFn2 = debounce(mockFn2, 500);

    debouncedFn1();
    debouncedFn2();

    jest.advanceTimersByTime(500);
    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
});
