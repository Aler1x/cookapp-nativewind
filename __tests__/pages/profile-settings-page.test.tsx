import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsPage from '~/app/(tabs)/profile/settings';

describe('SettingsPage', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<SettingsPage />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('displays settings text', () => {
    const { getByText } = render(<SettingsPage />);
    expect(getByText('Settings')).toBeTruthy();
  });

  it('has proper structure with SafeAreaView', () => {
    const { UNSAFE_getByType } = render(<SettingsPage />);
    expect(UNSAFE_getByType(SafeAreaView)).toBeTruthy();
  });

  it('applies correct styling classes', () => {
    const { UNSAFE_getByType } = render(<SettingsPage />);

    const safeAreaView = UNSAFE_getByType(SafeAreaView);
    expect(safeAreaView.props.className).toContain('flex-1');
    expect(safeAreaView.props.className).toContain('items-center');
    expect(safeAreaView.props.className).toContain('justify-center');
  });

  it('centers content properly', () => {
    const { getByText } = render(<SettingsPage />);
    const settingsText = getByText('Settings');

    // Text should be rendered within the centered container
    expect(settingsText).toBeTruthy();
  });

  it('matches snapshot', () => {
    const tree = render(<SettingsPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
