import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import React from 'react';

/**
 * Represents a feature option that can be displayed to users
 * @property id - Unique identifier for the option
 * @property icon - React component to display as the option's icon
 * @property label - Short title text for the option
 * @property description - Detailed explanation of what the option does
 *
 * @example
 * {
 *   id: 1,
 *   icon: <BookOpen className='h-5 w-5 text-primary' />,
 *   label: 'Recipes',
 *   description: 'Find recipes for you'
 * }
 */
export type Option = {
  id: number;
  icon: React.ReactNode;
  label: string;
  description: string;
};

interface HelpModalProps {
  title: string;
  onClose: () => void;
  options: Option[];
}

export default function HelpModal({ title, options, onClose }: HelpModalProps) {
  if (!options) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <View className='mb-6 flex-row items-center justify-center'>
        <Text className='flex-1 text-center text-2xl font-bold text-foreground'>{title}</Text>
      </View>

      {/* Options */}
      <View className='gap-3'>
        {options?.map((option) => (
          <View
            key={option.id}
            className='rounded-xl border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.98]'>
            <View className='flex-row items-center'>
              {/* Icon container */}
              <View className='mr-4 rounded-xl bg-primary/10 p-3'>{option.icon}</View>

              {/* Content */}
              <View className='flex-1'>
                <Text className='mb-1 text-lg font-semibold text-foreground'>{option.label}</Text>
                <Text className='text-sm leading-relaxed text-muted-foreground'>{option.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
