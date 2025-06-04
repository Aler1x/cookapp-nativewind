import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Text } from './ui/text';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export default function SearchBar({ placeholder = 'Search...', value, onChangeText, onSubmit }: SearchBarProps) {
  return (
    <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-2 my-3'>
      <Ionicons name='search' size={20} color='#9CA3AF' />
      <TextInput
        className='flex-1 ml-2 text-base'
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType='search'
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name='close-circle' size={20} color='#9CA3AF' />
        </TouchableOpacity>
      )}
    </View>
  );
}
