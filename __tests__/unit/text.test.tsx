import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '~/components/ui/text';

describe('Text Component', () => {
  it('renders with default Comfortaa font', () => {
    const { getByText } = render(<Text>Default Text</Text>);
    const textElement = getByText('Default Text');

    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontFamily: 'Comfortaa_400Regular' })])
    );
  });

  it('applies correct Comfortaa font for different weights', () => {
    const fontWeights = [
      { className: 'font-light', expectedFont: 'Comfortaa_300Light' },
      { className: 'font-regular', expectedFont: 'Comfortaa_400Regular' },
      { className: 'font-medium', expectedFont: 'Comfortaa_500Medium' },
      { className: 'font-semibold', expectedFont: 'Comfortaa_600SemiBold' },
      { className: 'font-bold', expectedFont: 'Comfortaa_700Bold' },
      { className: 'font-extrabold', expectedFont: 'Comfortaa_800ExtraBold' },
      { className: 'font-black', expectedFont: 'Comfortaa_900Black' },
    ];

    fontWeights.forEach(({ className, expectedFont }) => {
      const { getByText } = render(<Text className={className}>{className} Text</Text>);
      const textElement = getByText(`${className} Text`);

      expect(textElement.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ fontFamily: expectedFont })])
      );
    });
  });

  it('removes font weight classes from className', () => {
    const { getByText } = render(<Text className='font-bold text-red-500'>Bold Red Text</Text>);
    const textElement = getByText('Bold Red Text');

    // Font weight class should be removed, but other classes should remain
    expect(textElement.props.className).not.toContain('font-bold');
    expect(textElement.props.className).toContain('text-red-500');
  });

  it('handles multiple font weight classes correctly', () => {
    const { getByText } = render(<Text className='font-bold font-light text-blue-500'>Multiple Font Classes</Text>);
    const textElement = getByText('Multiple Font Classes');

    // Should use the last font weight class (font-bold)
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontFamily: 'Comfortaa_700Bold' })])
    );
  });

  it('preserves custom styles', () => {
    const customStyle = { color: 'red', fontSize: 20 };
    const { getByText } = render(<Text style={customStyle}>Styled Text</Text>);
    const textElement = getByText('Styled Text');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontFamily: 'Comfortaa_400Regular' }),
        expect.objectContaining(customStyle),
      ])
    );
  });

  it('works with asChild prop', () => {
    const { getByText } = render(
      <Text asChild>
        <Text>Child Text</Text>
      </Text>
    );
    const textElement = getByText('Child Text');

    expect(textElement).toBeTruthy();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<any>();
    render(<Text ref={ref}>Ref Text</Text>);

    expect(ref.current).toBeTruthy();
  });

  it('applies default tracking and text color classes', () => {
    const { getByText } = render(<Text>Default Classes</Text>);
    const textElement = getByText('Default Classes');

    expect(textElement.props.className).toContain('tracking-[0.05em]');
    expect(textElement.props.className).toContain('text-foreground');
  });
});
