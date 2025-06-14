import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { TextClassContext } from '~/components/ui/text';

const floatingButtonVariants = cva(
  'group flex items-center justify-center rounded-full absolute bottom-8 shadow-lg web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary web:hover:opacity-90 active:opacity-90',
        destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
        outline:
          'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        secondary: 'bg-secondary web:hover:opacity-80 active:opacity-80',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        black: 'bg-black',
      },
      size: {
        default: 'h-14 w-14 native:h-16 native:w-16',
        sm: 'h-12 w-12 native:h-14 native:w-14',
        lg: 'h-16 w-16 native:h-18 native:w-18',
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
  'web:whitespace-nowrap text-sm native:text-base font-medium text-foreground web:transition-colors',
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
