import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Text } from './ui/text';
import { View } from './ui/view';
import { Badge } from './ui/badge';

interface CategoryBadgeProps {
  title: string;
  icon?: ImageSourcePropType;
  isActive?: boolean;
  onPress?: () => void;
}

export default function CategoryBadge({ title, icon, isActive = false, onPress }: CategoryBadgeProps) {
  return (
    <TouchableOpacity onPress={onPress} className='items-center mr-4'>
      <View
        className={`w-16 h-16 rounded-full items-center justify-center mb-1 ${
          isActive ? 'bg-primary' : 'bg-gray-100'
        }`}>
        {icon ? (
          <Image source={icon} className='w-8 h-8' resizeMode='contain' />
        ) : (
          <Badge
            label={title.charAt(0).toUpperCase()}
            variant={isActive ? 'secondary' : 'default'}
            className={`w-10 h-10 items-center justify-center ${isActive ? 'bg-white' : 'bg-gray-200'}`}
            labelClasses={`text-lg ${isActive ? 'text-primary' : 'text-gray-500'}`}
          />
        )}
      </View>
      <Text className={`text-xs text-center ${isActive ? 'font-medium' : 'text-gray-500'}`}>{title}</Text>
    </TouchableOpacity>
  );
}
