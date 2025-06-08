import { iconWithClassName } from '~/lib/iconWithClassName';

// Mock cssInterop
const mockCssInterop = jest.fn();
jest.mock('nativewind', () => ({
  cssInterop: mockCssInterop,
}));

// Mock Lucide icon
const mockIcon = jest.fn() as any;

describe('iconWithClassName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls cssInterop with the icon and correct configuration', () => {
    iconWithClassName(mockIcon);

    expect(mockCssInterop).toHaveBeenCalledWith(mockIcon, {
      className: {
        target: 'style',
        nativeStyleToProp: {
          color: true,
          opacity: true,
          height: true,
          width: true,
        },
      },
    });
  });

  it('calls cssInterop only once per icon', () => {
    iconWithClassName(mockIcon);

    expect(mockCssInterop).toHaveBeenCalledTimes(1);
  });

  it('works with different icon types', () => {
    const anotherIcon = jest.fn() as any;

    iconWithClassName(mockIcon);
    iconWithClassName(anotherIcon);

    expect(mockCssInterop).toHaveBeenCalledTimes(2);
    expect(mockCssInterop).toHaveBeenNthCalledWith(1, mockIcon, expect.any(Object));
    expect(mockCssInterop).toHaveBeenNthCalledWith(2, anotherIcon, expect.any(Object));
  });

  it('configures all required style properties', () => {
    iconWithClassName(mockIcon);

    const config = mockCssInterop.mock.calls[0][1];
    expect(config.className.nativeStyleToProp).toEqual({
      color: true,
      opacity: true,
      height: true,
      width: true,
    });
  });

  it('targets style for className', () => {
    iconWithClassName(mockIcon);

    const config = mockCssInterop.mock.calls[0][1];
    expect(config.className.target).toBe('style');
  });

  it('has className as the main configuration key', () => {
    iconWithClassName(mockIcon);

    const config = mockCssInterop.mock.calls[0][1];
    expect(config).toHaveProperty('className');
    expect(typeof config.className).toBe('object');
  });

  it('enables color styling for icons', () => {
    iconWithClassName(mockIcon);

    const config = mockCssInterop.mock.calls[0][1];
    expect(config.className.nativeStyleToProp.color).toBe(true);
  });

  it('enables opacity styling for icons', () => {
    iconWithClassName(mockIcon);

    const config = mockCssInterop.mock.calls[0][1];
    expect(config.className.nativeStyleToProp.opacity).toBe(true);
  });

  it('enables size styling (height and width) for icons', () => {
    iconWithClassName(mockIcon);

    const config = mockCssInterop.mock.calls[0][1];
    expect(config.className.nativeStyleToProp.height).toBe(true);
    expect(config.className.nativeStyleToProp.width).toBe(true);
  });

  it('does not return anything (void function)', () => {
    const result = iconWithClassName(mockIcon);
    expect(result).toBeUndefined();
  });
});
