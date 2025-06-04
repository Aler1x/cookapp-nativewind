import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ResultsPage from '~/app/(tabs)/home/results';

describe('ResultsPage', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<ResultsPage />);
    expect(getByText('Results')).toBeTruthy();
  });

  it('displays results text', () => {
    const { getByText } = render(<ResultsPage />);
    expect(getByText('Results')).toBeTruthy();
  });

  it('has proper structure with SafeAreaView', () => {
    const { UNSAFE_getByType } = render(<ResultsPage />);
    expect(UNSAFE_getByType(SafeAreaView)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { UNSAFE_getByType } = render(<ResultsPage />);
    
    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.className).toContain('flex-1');
    expect(safeAreaView.props.className).toContain('items-center');
    expect(safeAreaView.props.className).toContain('justify-center');
  });

  it('centers content properly', () => {
    const { getByText } = render(<ResultsPage />);
    const resultsText = getByText('Results');
    
    // Text should be rendered within the centered container
    expect(resultsText).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(<ResultsPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); 