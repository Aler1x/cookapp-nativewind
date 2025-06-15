import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { ChevronDown, Search, X } from 'lucide-react-native';
import { THEME } from '~/lib/constants';
import debounce from 'lodash.debounce';

const DEFAULT_DATA: SelectListData[] = [];

export type SelectListData = {
  id: any;
  value: any;
  disabled?: boolean;
};

export interface SelectListProps {
  setSelected: (value: any) => void;
  placeholder?: string;
  boxStyles?: ViewStyle;
  inputStyles?: TextStyle;
  dropdownStyles?: ViewStyle;
  dropdownItemStyles?: ViewStyle;
  dropdownTextStyles?: TextStyle;
  maxHeight?: number;
  data?: SelectListData[];
  defaultOption?: { id: any; value: any };
  search?: boolean;
  searchPlaceholder?: string;
  onSelect?: () => void;
  fontFamily?: string;
  notFoundText?: string;
  disabledItemStyles?: ViewStyle;
  disabledTextStyles?: TextStyle;
  value?: any;
  dropdownShown?: boolean;
  fetchItems: (query: string) => Promise<SelectListData[]>;
  allowFreeText?: boolean;
}

const InputWithDropdown: React.FC<SelectListProps> = ({
  setSelected,
  placeholder,
  boxStyles,
  inputStyles,
  dropdownStyles,
  dropdownItemStyles,
  dropdownTextStyles,
  maxHeight,
  data = DEFAULT_DATA, // buttplug
  defaultOption,
  search = true,
  searchPlaceholder = 'search',
  notFoundText = 'No data found',
  disabledItemStyles,
  disabledTextStyles,
  onSelect = () => {},
  value,
  dropdownShown = false,
  fontFamily,
  fetchItems,
  allowFreeText = false,
}) => {
  const oldOption = React.useRef(null);
  const textInputRef = React.useRef<TextInput>(null);
  const [_firstRender, _setFirstRender] = React.useState<boolean>(true);
  const [dropdown, setDropdown] = React.useState<boolean>(dropdownShown);
  const [selectedVal, setSelectedVal] = React.useState<any>('');
  const [height, setHeight] = React.useState<number>(200);
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [filteredData, setFilteredData] = React.useState<SelectListData[]>(data);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Store fetchItems in a ref to avoid dependency issues
  const fetchItemsRef = React.useRef(fetchItems);
  React.useEffect(() => {
    fetchItemsRef.current = fetchItems;
  }, [fetchItems]);

  const debouncedFetch = React.useCallback(
    debounce(async (query: string) => {
      if (!fetchItemsRef.current || !search || !query || query.length < 2) return;

      setIsLoading(true);
      try {
        const results = await fetchItemsRef.current(query);
        setFilteredData(results);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [search]
  );

  const slidedown = React.useCallback(() => {
    setDropdown(true);
    Animated.timing(animatedValue, {
      toValue: height,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      // Focus the text input after animation completes
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    });
  }, [height, animatedValue]);

  const slideup = React.useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => setDropdown(false));
  }, [animatedValue]);

  React.useEffect(() => {
    if (maxHeight) setHeight(maxHeight);
  }, [maxHeight]);

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  React.useEffect(() => {
    if (_firstRender) {
      _setFirstRender(false);
      return;
    }
    onSelect();
  }, [selectedVal]);

  React.useEffect(() => {
    if (!_firstRender && defaultOption && oldOption.current != defaultOption.id) {
      oldOption.current = defaultOption.id;
      setSelected(defaultOption.id);
      setSelectedVal(defaultOption.value);
    }
    if (defaultOption && _firstRender && defaultOption.id != undefined) {
      oldOption.current = defaultOption.id;
      setSelected(defaultOption.id);
      setSelectedVal(defaultOption.value);
    }
  }, [defaultOption]);

  React.useEffect(() => {
    if (!_firstRender) {
      if (dropdownShown) slidedown();
      else slideup();
    }
  }, [dropdownShown]);

  // Handle search input changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    debouncedFetch(query);
    if (allowFreeText) {
      setSelected(query);
    }
  };

  // Initialize with empty search on first dropdown open
  React.useEffect(() => {
    if (dropdown && search && fetchItemsRef.current && searchQuery === '') {
      debouncedFetch('');
    }
  }, [dropdown, search, searchQuery, debouncedFetch]);

  const getText = () => {
    if (selectedVal !== '') {
      return selectedVal;
    }
    if (searchQuery !== '') {
      return searchQuery;
    }
    return placeholder ? placeholder : 'Select option';
  }

  return (
    <View>
      {dropdown && search ? (
        <View style={[styles.wrapper, boxStyles]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Search size={20} color={THEME.light.colors.primary} style={{ marginRight: 10 }} />

            <TextInput
              ref={textInputRef}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onBlur={() => {
                slideup();
              }}
              style={[{ padding: 0, height: 20, flex: 1, fontFamily }, inputStyles]}
            />
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                slideup();
              }}>
              <X size={20} color={THEME.light.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.wrapper, boxStyles]}
          onPress={() => {
            if (!dropdown) {
              slidedown();
            } else {
              slideup();
            }
          }}>
          <Text style={[{ fontFamily }, inputStyles]}>
            {getText()}
          </Text>
          <ChevronDown size={20} color={THEME.light.colors.primary} />
        </TouchableOpacity>
      )}

      {dropdown ? (
        <Animated.View style={[{ maxHeight: animatedValue }, styles.dropdown, dropdownStyles]}>
          <ScrollView
            contentContainerStyle={{ paddingVertical: 10, overflow: 'hidden' }}
            keyboardDismissMode='none'
            keyboardShouldPersistTaps='always'
            nestedScrollEnabled={true}>
            {isLoading ? (
              <View style={[styles.option, dropdownItemStyles]}>
                <Text style={[{ fontFamily }, dropdownTextStyles]}>Loading...</Text>
              </View>
            ) : filteredData.length >= 1 ? (
              filteredData.map((item: SelectListData, index: number) => {
                let value = item.value;
                let disabled = item.disabled ?? false;
                if (disabled) {
                  return (
                    <TouchableOpacity
                      style={[styles.disabledoption, disabledItemStyles]}
                      key={item.id || index}
                      onPress={() => {}}>
                      <Text style={[{ color: '#c4c5c6', fontFamily }, disabledTextStyles]}>{value}</Text>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      style={[styles.option, dropdownItemStyles]}
                      key={item.id || index}
                      onPress={() => {
                        setSelected(item);
                        setSelectedVal(value);
                        slideup();
                        setSearchQuery('');
                      }}>
                      <Text style={[{ fontFamily }, dropdownTextStyles]}>{value}</Text>
                    </TouchableOpacity>
                  );
                }
              })
            ) : (
              <TouchableOpacity
                style={[styles.option, dropdownItemStyles]}
                onPress={() => {
                  setSelected(undefined);
                  setSelectedVal('');
                  slideup();
                  setSearchQuery('');
                }}>
                <Text style={[{ fontFamily }, dropdownTextStyles]}>{notFoundText}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default InputWithDropdown;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdown: { borderWidth: 1, borderRadius: 10, borderColor: 'gray', marginTop: 5, overflow: 'hidden' },
  option: { paddingHorizontal: 20, paddingVertical: 8, overflow: 'hidden' },
  disabledoption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    opacity: 0.9,
  },
});
