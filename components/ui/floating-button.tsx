import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { TextClassContext } from '~/components/ui/text';

const floatingButtonVariants = cva(
  'group absolute bottom-8 flex items-center justify-center rounded-full shadow-lg web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary active:opacity-90 web:hover:opacity-90',
        destructive: 'bg-destructive active:opacity-90 web:hover:opacity-90',
        outline:
          'border border-input bg-background active:bg-accent web:hover:bg-accent web:hover:text-accent-foreground',
        secondary: 'bg-secondary active:opacity-80 web:hover:opacity-80',
        ghost: 'active:bg-accent web:hover:bg-accent web:hover:text-accent-foreground',
        black: 'bg-black',
      },
      size: {
        default: 'native:h-16 native:w-16 h-14 w-14',
        sm: 'native:h-14 native:w-14 h-12 w-12',
        lg: 'native:h-18 native:w-18 h-16 w-16',
      },
      position: {
        left: 'left-6',
        right: 'right-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'right',
    },
  }
);

const floatingButtonTextVariants = cva(
  'native:text-base text-sm font-medium text-foreground web:whitespace-nowrap web:transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        black: 'text-white',
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type FloatingButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof floatingButtonVariants>;

const FloatingButton = React.forwardRef<React.ElementRef<typeof Pressable>, FloatingButtonProps>(
  ({ className, variant, size, position, ...props }, ref) => {
    return (
      <TextClassContext.Provider
        value={floatingButtonTextVariants({
          variant,
          size,
          className: 'web:pointer-events-none',
        })}>
        <Pressable
          className={cn(
            props.disabled && 'opacity-50 web:pointer-events-none',
            floatingButtonVariants({ variant, size, position, className })
          )}
          ref={ref}
          role='button'
          {...props}
        />
      </TextClassContext.Provider>
    );
  }
);
FloatingButton.displayName = 'FloatingButton';

export { FloatingButton, floatingButtonTextVariants, floatingButtonVariants };
export type { FloatingButtonProps };
