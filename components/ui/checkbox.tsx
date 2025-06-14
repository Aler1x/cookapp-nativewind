import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { Platform } from 'react-native';
import { Check } from '~/lib/icons/Check';
import { cn } from '~/lib/utils';
import { cva } from 'class-variance-authority';

const checkboxVariants = cva('web:peer h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {
  variants: {
    variant: {
      primary: 'border-primary',
      secondary: 'border-secondary',
      black: 'border-black',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

function Checkbox({
  className,
  size = 20,
  variant = 'primary',
  ...props
}: CheckboxPrimitive.RootProps & {
  ref?: React.RefObject<CheckboxPrimitive.RootRef>;
  size?: number;
  variant?: 'primary' | 'secondary' | 'black';
}) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        checkboxVariants({ variant }),
        props.checked && 'bg-primary border-primary',
        className
      )}
      {...props}>
      <CheckboxPrimitive.Indicator className={cn('items-center justify-center h-full w-full')}>
        <Check
          size={size}
          strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
          className={cn('text-primary-foreground text-white')}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
