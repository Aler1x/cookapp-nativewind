import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { THEME } from '~/lib/constants';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export default function SearchInput({ placeholder = 'Search...', value, onChangeText, onSubmit }: SearchBarProps) {
  return (
    <View
      className='flex-row items-center rounded-full border border-black bg-white px-4 py-2 shadow-md'
      style={{
        elevation: 5,
      }}>
      <Search size={20} color={THEME.light.colors.foreground} />
      <TextInput
        className='ml-2 flex-1 p-1 text-base'
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType='search'
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onSubmit?.();
          }}>
          <X size={20} color={THEME.light.colors.foreground} />
        </TouchableOpacity>
      )}
    </View>
  );
}
