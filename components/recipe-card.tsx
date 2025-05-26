import { View } from '~/components/ui/view';
import { Text } from './ui/text';
import { TouchableOpacity, Image } from 'react-native';
import { cn } from '~/lib/utils';
import { router } from 'expo-router';
import { Badge } from './ui/badge';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  size: 'small' | 'medium' | 'large';
  rating?: number;
  duration?: number;
  onPress?: () => void;
  style?: any;
}

export default function RecipeCard({ id, title, image, size, rating, duration, onPress, style }: RecipeCardProps) {
  const cardSize = () => {
    switch (size) {
      case 'small':
        return 'w-32 h-32';
      case 'medium':
        return 'w-48 h-56';
      case 'large':
        return 'w-full h-60 max-w-[80vw]';
      default:
        return 'w-40 h-48';
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/recipes/${id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className='m-2'>
      <View className={cn('rounded-3xl overflow-hidden', cardSize())} style={{ ...style }}>
        {image ? (
          <Image source={{ uri: image }} className='w-full h-2/3' resizeMode='cover' />
        ) : (
          <View className='w-full h-2/3 bg-gray-200' />
        )}
        <View className='p-3 flex-1 justify-between'>
          <Text className='font-medium text-base' numberOfLines={1}>
            {title}
          </Text>
          <View className='flex-row justify-between items-center mt-1'>
            {rating !== undefined && (
              <View className='flex-row items-center'>
                <Text className='text-xs mr-1'>★</Text>
                <Text className='text-xs'>{rating.toFixed(1)}</Text>
              </View>
            )}
            {duration !== undefined && <Text className='text-xs text-gray-600'>{duration} min</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
