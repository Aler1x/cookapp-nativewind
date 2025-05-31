import HomePage from '~/app/(tabs)/home';
import { render } from '@testing-library/react-native';

describe('<HomeScreen />', () => {
  test('CustomText renders correctly', () => {
    const tree = render(<HomePage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
