import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Text } from './ui/text';
import { View } from './ui/view';
import { Badge } from './ui/badge';
import { capitalizeFirstLetter } from '~/lib/utils';

interface CategoryBadgeProps {
  title: string;
  icon?: ImageSourcePropType;
  isActive?: boolean;
  onPress?: () => void;
}

export default function CategoryBadge({ title, icon, isActive = false, onPress }: CategoryBadgeProps) {
  return (
    <TouchableOpacity onPress={onPress} className='mr-4 items-center'>
      <View
        className={`mb-1 h-16 w-16 items-center justify-center rounded-full ${
          isActive ? 'bg-primary' : 'bg-gray-100'
        }`}>
        {icon ? (
          <Image source={icon} className='h-8 w-8' resizeMode='contain' />
        ) : (
          <Badge
            label={capitalizeFirstLetter(title)}
            variant={isActive ? 'secondary' : 'default'}
            className={`h-10 w-10 items-center justify-center ${isActive ? 'bg-white' : 'bg-gray-200'}`}
            labelClasses={`text-lg ${isActive ? 'text-primary' : 'text-gray-500'}`}
          />
        )}
      </View>
      <Text className={`text-center text-xs ${isActive ? 'font-medium' : 'text-gray-500'}`}>{title}</Text>
    </TouchableOpacity>
  );
}
