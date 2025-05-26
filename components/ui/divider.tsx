import React from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';

interface DividerProps {
  className?: string;
  horizontal?: boolean;
}

export function Divider({ className, horizontal = false }: DividerProps) {
  return (
    <View
      className={cn(
        'bg-border',
        horizontal
          ? 'h-full w-px' // vertical line
          : 'h-px w-full', // horizontal line
        className
      )}
    />
  );
}
