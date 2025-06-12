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
    <View className='flex-row items-center bg-white rounded-full px-4 py-2'>
      <Search size={20} color={THEME.light.colors.foreground} />
      <TextInput
        className='flex-1 ml-2 text-base p-1'
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType='search'
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => {
          onChangeText('');
          onSubmit?.();
        }}>
          <X size={20} color={THEME.light.colors.foreground} />
        </TouchableOpacity>
      )}
    </View>
  );
}
