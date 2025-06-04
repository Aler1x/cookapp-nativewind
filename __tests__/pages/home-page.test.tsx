import React from 'react';
import { render } from '@testing-library/react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePage from '~/app/(tabs)/home/index';

describe('HomePage', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('What do you want to cook today?')).toBeTruthy();
  });

  it('displays welcome message', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('What do you want to cook today?')).toBeTruthy();
  });

  it('has proper structure with SafeAreaView and ScrollView', () => {
    const { UNSAFE_getByType } = render(<HomePage />);

    expect(UNSAFE_getByType(SafeAreaView)).toBeTruthy();
    expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
  });

  it('applies correct styling classes to SafeAreaView', () => {
    const { UNSAFE_getByType } = render(<HomePage />);

    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.className).toContain('flex-1');
    expect(safeAreaView.props.className).toContain('bg-background');
  });

  it('applies correct styling classes to ScrollView', () => {
    const { UNSAFE_getByType } = render(<HomePage />);

    const scrollView = UNSAFE_getByType(ScrollView);
    expect(scrollView.props.className).toContain('flex-1');
    expect(scrollView.props.className).toContain('px-4');
  });

  it('applies correct styling to welcome text', () => {
    const { getByText } = render(<HomePage />);

    const welcomeText = getByText('What do you want to cook today?');
    expect(welcomeText.props.className).toContain('text-2xl');
  });

  it('has proper content structure', () => {
    const { getByText } = render(<HomePage />);

    // Should have the welcome message
    expect(getByText('What do you want to cook today?')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(<HomePage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); 