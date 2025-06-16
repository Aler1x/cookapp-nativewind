import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { ChatMessage } from '~/types/chat';

export interface ChatBubbleProps {
  chatMessage: ChatMessage;
}

export default function ChatBubble({ chatMessage }: ChatBubbleProps) {

  if (chatMessage.role === 'USER') {
    return (
      <View className='flex-row justify-end mb-2'>
        <View className='relative max-w-[75%]'>
          <View className='rounded-2xl px-4 py-3 rounded-br-sm bg-primary'>
            <Text className='text-foreground'>{chatMessage.content}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (chatMessage.content.messageType === 'TEXT') {
    return (
      <View className='flex-row justify-start mb-2'>
        <View className='relative max-w-[75%]'>
          <View className='rounded-2xl px-4 py-3 rounded-bl-sm bg-secondary'>
            <Text className='text-foreground'>{chatMessage.content.message}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (chatMessage.content.messageType === 'RECIPE_DETAILS') {
    return (
      <View className='flex-row justify-start mb-2'>
        <View className='relative max-w-[75%]'>
          <View className='rounded-2xl px-4 py-3 rounded-bl-sm bg-secondary'>
            <Text className='text-foreground'>{chatMessage.content.recipe.title}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (chatMessage.content.messageType === 'GALLERY') {
    return (
      <View className='flex-row justify-start mb-2'>
        <View className='relative max-w-[75%]'>
          <View className='rounded-2xl px-4 py-3 rounded-bl-sm bg-secondary'>
            <Text className='text-foreground'>{chatMessage.content.gallery.map((item) => item.title).join(', ')}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (chatMessage.content.messageType === 'JOB_STATUS') {
    return (
      <View className='flex-row justify-start mb-2'>
        <View className='relative max-w-[75%]'>
          <View className='rounded-2xl px-4 py-3 rounded-bl-sm bg-secondary'>
            <Text className='text-foreground'>{chatMessage.content.jobStatus.status}</Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
};
