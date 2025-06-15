import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { cn } from '~/lib/utils';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, className, style }: SkeletonProps) {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      className={cn('rounded bg-gray-300', className)}
      style={[
        {
          width,
          height,
          opacity,
        },
        style,
      ]}
    />
  );
}
