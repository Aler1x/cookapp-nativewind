import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import * as React from 'react';
import { Platform } from 'react-native';
import { Check } from '~/lib/icons/Check';
import { cn } from '~/lib/utils';
import { cva } from 'class-variance-authority';

const checkboxVariants = cva(
  'web:peer native:h-[20] native:w-[20] native:rounded h-4 w-4 shrink-0 rounded-sm border disabled:cursor-not-allowed disabled:opacity-50 web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
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
  }
);

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
      className={cn(checkboxVariants({ variant }), props.checked && 'border-primary bg-primary', className)}
      {...props}>
      <CheckboxPrimitive.Indicator className={cn('h-full w-full items-center justify-center')}>
        <Check
          size={size}
          strokeWidth={Platform.OS === 'web' ? 2.5 : 3.5}
          className={cn('text-primary-foreground')}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
