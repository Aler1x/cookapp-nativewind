import { View } from 'react-native';
import { Text } from '~/components/ui/text';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <View className={`flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <View className='relative max-w-[75%]'>
        <View className={`rounded-2xl px-4 py-3 ${isUser ? 'rounded-br-sm bg-primary' : 'rounded-bl-sm bg-secondary'}`}>
          <Text className='text-foreground'>{message}</Text>
        </View>
      </View>
    </View>
  );
}
