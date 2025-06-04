import React, { memo } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Input } from './input';
import { Text } from './text';
import { View } from './view';
import { THEME } from '~/lib/constants';

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
  maxDropdownHeight?: number;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  onBottom?: boolean;
}

function InputWithDropdown({
  label,
  placeholder,
  value,
  onChangeText,
  items,
  onItemSelect,
  showDropdown,
  isLoading = false,
  maxDropdownHeight = 160,
  autoFocus = false,
  keyboardType = 'default',
  className = 'mb-4',
  inputClassName = 'border border-gray-300 rounded-lg px-3 py-2',
  dropdownClassName,
  onBottom = false,
}: InputWithDropdownProps) {
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
      {isLoading && (
        <View className='absolute right-2 flex items-center justify-center'>
          <ActivityIndicator size='small' color={THEME.light.colors.primary} />
        </View>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <View
          className={dropdownClassName || 'bg-background border border-primary rounded-lg mt-1'}
          style={{
            position: 'absolute',
            top: onBottom ? '100%' : 'auto',
            bottom: onBottom ? 'auto' : '60%',
            left: 0,
            right: 0,
            maxHeight: maxDropdownHeight,
            zIndex: 1005,
            elevation: 5,
            shadowColor: '#000',
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
                activeOpacity={0.7}
                delayPressIn={0}
                style={{ backgroundColor: 'white' }}>
                <Text className='text-sm'>{item.label}</Text>
                {item.sublabel && <Text className='text-xs text-gray-500'>{item.sublabel}</Text>}
              </TouchableOpacity>
            )}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: 'white' }}
          />
        </View>
      )}
    </View>
  );
}

export default memo(InputWithDropdown);
