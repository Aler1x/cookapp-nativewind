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
        {/* Main bubble */}
        <View className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-primary rounded-br-sm' : 'bg-secondary rounded-bl-sm'}`}>
          <Text className='text-foreground'>{message}</Text>
        </View>
      </View>
    </View>
  );
}
