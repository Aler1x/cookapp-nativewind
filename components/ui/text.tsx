import * as Slot from '@rn-primitives/slot';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '~/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = SlottableTextProps;

// Helper function to determine the correct Comfortaa font family and remove font classes
function processClassName(className?: string): {
  fontFamily: string;
  cleanClassName: string;
} {
  if (!className) {
    return {
      fontFamily: 'Comfortaa_400Regular',
      cleanClassName: '',
    };
  }

  let fontFamily = 'Comfortaa_400Regular';

  // Check for Tailwind font weight classes and determine font family
  if (className.includes('font-light')) fontFamily = 'Comfortaa_300Light';
  else if (className.includes('font-medium')) fontFamily = 'Comfortaa_500Medium';
  else if (className.includes('font-semibold')) fontFamily = 'Comfortaa_600SemiBold';
  else if (className.includes('font-bold')) fontFamily = 'Comfortaa_700Bold';
  else if (className.includes('font-extrabold')) fontFamily = 'Comfortaa_800ExtraBold';
  else if (className.includes('font-black')) fontFamily = 'Comfortaa_900Black';
  else if (className.includes('font-regular')) fontFamily = 'Comfortaa_400Regular';

  // Remove font weight classes from className
  const cleanClassName = className
    .replace(/\bfont-light\b/g, '')
    .replace(/\bfont-medium\b/g, '')
    .replace(/\bfont-semibold\b/g, '')
    .replace(/\bfont-bold\b/g, '')
    .replace(/\bfont-extrabold\b/g, '')
    .replace(/\bfont-black\b/g, '')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();

  return { fontFamily, cleanClassName };
}

const Text = React.forwardRef<TextRef, TextProps>(({ className, asChild = false, style, ...props }, ref) => {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;

  // Combine all className sources
  const combinedClassName = cn(textClass, className);

  // Process className to extract font family and clean className
  const { fontFamily, cleanClassName } = processClassName(combinedClassName);

  // Merge styles properly
  const mergedStyle = [{ fontFamily }, style];

  return (
    <Component
      className={cn('text-base tracking-[0.05em] text-foreground web:select-text', cleanClassName)}
      ref={ref}
      style={mergedStyle}
      {...props}
    />
  );
});
Text.displayName = 'Text';

export { Text, TextClassContext };
