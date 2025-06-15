import { BookOpen, ChefHat, CookingPot } from 'lucide-react-native';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { ChatFeature } from '~/types/chat';
import React from 'react';

interface ChatWhatICanProps {
  onClose: () => void;
}

export default function ChatWhatICan({ onClose }: ChatWhatICanProps) {
  const options: ChatFeature[] = [
    {
      id: 1,
      icon: <BookOpen className='h-5 w-5 text-primary' />,
      label: 'Recipes',
      description: 'Find recipes for you',
    },
    {
      id: 2,
      icon: <CookingPot className='h-5 w-5 text-primary' />,
      label: 'Create',
      description: 'Create a recipe for you',
    },
    {
      id: 3,
      icon: <ChefHat className='h-5 w-5 text-primary' />,
      label: 'Answer questions',
      description: 'Ask me anything about recipes',
    },
  ];

  return (
    <>
      {/* Header */}
      <View className='mb-6 flex-row items-center justify-center'>
        <Text className='flex-1 text-center text-2xl font-bold text-foreground'>What can I do for you?</Text>
      </View>

      {/* Options */}
      <View className='gap-3'>
        {options.map((option) => (
          <View
            key={option.id}
            className='rounded-xl border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.98]'>
            <View className='flex-row items-center'>
              {/* Icon container */}
              <View className='mr-4 rounded-xl bg-primary/10 p-3'>{option.icon}</View>

              {/* Content */}
              <View className='flex-1'>
                <Text className='mb-1 text-lg font-semibold text-foreground'>{option.label}</Text>
                <Text className='text-sm leading-relaxed text-muted-foreground'>{option.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}
