import { Modal, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface BasicModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'none';
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Enhanced Basic Modal Component with separate animations
 * - Backdrop: Fade in/out animation
 * - Modal Content: Slide from bottom with spring animation
 * - Backdrop tap to close with smooth animation
 */
export default function BasicModal({
  isModalOpen,
  setIsModalOpen,
  children,
  animationType = 'fade',
  className,
}: BasicModalProps) {
  const backdropOpacity = useSharedValue(0);
  const modalTranslateY = useSharedValue(500);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalTranslateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic), // Smooth deceleration
      });
    } else {
      // Animate out
      backdropOpacity.value = withTiming(0, { duration: 200 });
      modalTranslateY.value = withTiming(1000, { duration: 250 });
    }

    // we don't need to re-render in other cases, fuck you eslint
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalTranslateY.value }],
    };
  });

  const handleBackdropPress = () => {
    // Animate out then close
    backdropOpacity.value = withTiming(0, { duration: 200 });
    modalTranslateY.value = withTiming(1000, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(closeModal)();
      }
    });
  };

  const handleModalPress = () => {
    // Prevent event bubbling when pressing on modal content
  };

  return (
    <Modal
      visible={isModalOpen}
      onRequestClose={handleBackdropPress}
      onAccessibilityEscape={handleBackdropPress}
      animationType='none' // We handle animations ourselves
      transparent={true}>
      <AnimatedPressable
        className='flex-1 justify-end'
        style={[
          {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          backdropAnimatedStyle,
        ]}
        onPress={handleBackdropPress}>
        <AnimatedPressable
          className={cn('bg-background rounded-t-2xl w-full shadow-2xl p-6 max-h-[80%]', className)}
          style={modalAnimatedStyle}
          onPress={handleModalPress}>
          {children}
        </AnimatedPressable>
      </AnimatedPressable>
    </Modal>
  );
}
