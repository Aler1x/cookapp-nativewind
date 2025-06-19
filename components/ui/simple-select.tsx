import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Text } from '~/components/ui/text';
import BasicModal from '~/components/ui/basic-modal';
import { cn } from '~/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export default function SimpleSelect({
  options,
  value,
  placeholder = 'Select an option',
  onValueChange,
  className,
  disabled = false,
}: SimpleSelectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelectOption = (optionValue: string) => {
    onValueChange(optionValue);
    setIsModalOpen(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      className={cn(
        'flex-row items-center justify-between py-4 px-4 border-b border-gray-100 rounded-lg',
        item.value === value && 'border-primary border'
      )}
      onPress={() => handleSelectOption(item.value)}
    >
      <Text className={cn(
        'text-base',
        item.value === value ? 'font-medium text-primary' : 'text-gray-900'
      )}>
        {item.label}
      </Text>
      {item.value === value && (
        <Check size={20} className="text-primary" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        className={cn(
          'flex-row items-center justify-between px-3 py-3 border border-gray-300 rounded-lg bg-background',
          disabled && 'opacity-50 bg-background/50',
          className
        )}
        onPress={() => !disabled && setIsModalOpen(true)}
        disabled={disabled}
      >
        <Text className={cn(
          'text-sm',
          selectedOption ? 'text-gray-900' : 'text-gray-500'
        )}>
          {selectedOption?.label || placeholder}
        </Text>
        <ChevronDown
          size={20}
          className={cn(
            'text-gray-400',
            disabled && 'text-gray-300'
          )}
        />
      </TouchableOpacity>

      <BasicModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        className="max-h-96"
      >
        <View className="gap-4">
          <Text className="text-lg font-semibold text-center">
            {placeholder}
          </Text>
          
          <FlatList
            data={options}
            renderItem={renderOption}
            keyExtractor={item => item.value}
            showsVerticalScrollIndicator={false}
            className="max-h-80"
          />
        </View>
      </BasicModal>
    </>
  );
} 