import React from 'react';
import { View, FlatList, TouchableOpacity, Text as RNText } from 'react-native';
import { Input } from './input';
import { Text } from './text';

interface DropdownItem {
  id: string;
  label: string;
  sublabel?: string;
  value: any;
}

interface InputWithDropdownProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  items: DropdownItem[];
  onItemSelect: (item: DropdownItem) => void;
  showDropdown: boolean;
  isLoading?: boolean;
  loadingText?: string;
  maxDropdownHeight?: number;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
}

export const InputWithDropdown: React.FC<InputWithDropdownProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  items,
  onItemSelect,
  showDropdown,
  isLoading = false,
  loadingText = 'Searching...',
  maxDropdownHeight = 160,
  autoFocus = false,
  keyboardType = 'default',
  className = 'mb-4',
  inputClassName = 'border border-gray-300 rounded-lg px-3 py-2',
  dropdownClassName,
}) => {
  console.log('InputWithDropdown render:', { showDropdown, itemsLength: items.length, value });
  
  return (
    <View className={className} style={{ zIndex: 1000 }}>
      {label && <Text className='text-sm font-medium mb-2'>{label}</Text>}
      <Input
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
      />
      {isLoading && <Text className='text-xs text-gray-500 mt-1'>{loadingText}</Text>}

      {/* Dropdown */}
      {showDropdown && items.length > 0 && (
        <View 
          className={dropdownClassName || 'bg-white border border-gray-300 rounded-lg mt-1'}
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: maxDropdownHeight,
            zIndex: 1001,
            elevation: 5, // For Android shadow
            shadowColor: '#000', // For iOS shadow
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className='px-3 py-2 border-b border-gray-100 last:border-b-0'
                onPress={() => onItemSelect(item)}
                style={{ backgroundColor: 'white' }}>
                <Text className='text-sm'>{item.label}</Text>
                {item.sublabel && (
                  <Text className='text-xs text-gray-500'>{item.sublabel}</Text>
                )}
              </TouchableOpacity>
            )}
            nestedScrollEnabled
            style={{ backgroundColor: 'white' }}
          />
        </View>
      )}
    </View>
  );
}; 