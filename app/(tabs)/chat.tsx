import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import ChatBubble from '~/components/chat-bubble';
import { BookOpen, ChefHat, CookingPot, Info, Send } from '~/assets/icons';
import { Textarea } from '~/components/ui/textarea';
import { Message } from '~/types/chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicModal from '~/components/ui/basic-modal';
import HelpModal, { Option } from '~/components/modals/information';

export const CHAT_HELP_OPTIONS: Option[] = [
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

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: 'What do you want to cook today?',
      isUser: false,
    },
  ]);

  // const $fetch = useFetch();

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']} style={{ padding: 16 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, height: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View className='w-full flex-row items-center justify-between'>
          <Text className='text-2xl font-bold'>CookBot</Text>
          <TouchableOpacity
            className='p-2'
            onPress={() => {
              setIsModalOpen(true);
            }}>
            <Info className='h-8 w-8' />
          </TouchableOpacity>
        </View>

        <BasicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <HelpModal title='What can I do for you?' options={CHAT_HELP_OPTIONS} onClose={() => setIsModalOpen(false)} />
        </BasicModal>

        <ScrollView
          className='w-full flex-1 flex-col-reverse'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps='handled'>
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message.message} isUser={message.isUser} />
          ))}
        </ScrollView>

        <View className='mb-4 w-full flex-row items-end gap-2'>
          <Textarea
            placeholder='Ask me anything about recipes'
            className='flex-1 rounded-lg bg-background p-2'
            value={message}
            numberOfLines={2}
            onChangeText={setMessage}
          />

          <Button
            variant='outline'
            onPress={() => {
              if (message.trim() === '') {
                return;
              }
              setMessages([
                ...messages,
                {
                  id: messages.length + 1,
                  message: message,
                  isUser: true,
                },
              ]);
              setMessage('');
            }}>
            <Send className='h-6 w-6 text-primary' />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
