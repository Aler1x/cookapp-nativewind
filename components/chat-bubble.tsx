import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { ChatMessage } from '~/types/chat';
import RecipeCard from './recipe-card';
import JobCard from './pages/chat/job-card';

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
      <View className='flex-row justify-start mb-4'>
        <View className='w-full'>
          <View className='rounded-2xl px-4 py-3 bg-secondary mb-2'>
            <Text className='text-foreground'>{chatMessage.content.message}</Text>
          </View>
          <View className='max-w-[50%] h-56'>
            <RecipeCard recipe={chatMessage.content.recipe} className='w-full h-80' />
          </View>
        </View>
      </View>
    );
  }

  if (chatMessage.content.messageType === 'GALLERY') {
    return (
      <View className='flex-row justify-start mb-4'>
        <View className='w-full'>
          <View className='rounded-2xl px-4 py-3 bg-secondary mb-2'>
            <Text className='text-foreground'>{chatMessage.content.message}</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            className='flex-row'
            scrollEventThrottle={16}
          >
            {chatMessage.content.recipes.map((recipe, index) => (
              <View key={recipe.id} className='mr-3' style={{ width: 180, height: 250 }}>
                <RecipeCard recipe={recipe} className='w-full h-full' />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  if (chatMessage.content.messageType === 'JOB_STATUS') {
    return (
      <View className='flex-row justify-start mb-4'>
        <View className='w-full max-w-sm'>
          <View className='rounded-2xl px-4 py-3 bg-secondary mb-2'>
            <Text className='text-foreground'>{chatMessage.content.message}</Text>
          </View>
          <JobCard job={chatMessage.content.jobInfo} />
        </View>
      </View>
    );
  }

  return null;
};
