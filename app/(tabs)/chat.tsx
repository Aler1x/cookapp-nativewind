import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import ChatBubble from '~/components/chat-bubble';
import { BookOpen, ChefHat, CookingPot, History, Info, MessageSquarePlus, Send } from '~/assets/icons';
import { Textarea } from '~/components/ui/textarea';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicModal from '~/components/ui/basic-modal';
import HelpModal, { Option } from '~/components/modals/information';
import { useChat } from '~/hooks/useChat';
import { useChatStore } from '~/stores/chat';
import { useAuth } from '@clerk/clerk-expo';
import AuthPage from '~/components/pages/auth';

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
  const { isSignedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const { sendMessage, fetchUserChats, createNewChat } = useChat();
  const { userChats, currentChat } = useChatStore();

  useEffect(() => {
    if (isSignedIn) {
      fetchUserChats();
    }
  }, [fetchUserChats, isSignedIn]);

  if (!isSignedIn) {
    return <AuthPage />;
  }

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']} style={{ padding: 16 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, height: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <View className='w-full flex-row items-center justify-between'>
          <Text className='text-2xl font-bold'>CookBot</Text>
          <View className='flex-row items-center gap-2'>
            <TouchableOpacity
              className='p-2'
              onPress={() => {
                createNewChat();
              }}>
              <MessageSquarePlus className='h-8 w-8' />
            </TouchableOpacity>

            {process.env.NODE_ENV === 'development' &&
              <TouchableOpacity
                className='p-2'
                onPress={() => {
                  setIsHistoryModalOpen(true);
                }}>
                <History className='h-8 w-8' />
              </TouchableOpacity>
            }

            <TouchableOpacity
              className='p-2'
              onPress={() => {
                setIsModalOpen(true);
              }}>
              <Info className='h-8 w-8' />
            </TouchableOpacity>
          </View>
        </View>

        <BasicModal isModalOpen={isHistoryModalOpen} setIsModalOpen={setIsHistoryModalOpen}>
          <Text className='text-lg font-bold'>History</Text>
          <View className='flex-col gap-2'>
            {userChats.map((chat) => (
              <View key={chat.chatId} className='border border-border p-2'>
                <Text>{chat.chatId}</Text>
              </View>
            ))}
          </View>
        </BasicModal>

        <BasicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <HelpModal title='What can I do for you?' options={CHAT_HELP_OPTIONS} onClose={() => setIsModalOpen(false)} />
        </BasicModal>

        <ScrollView
          className='w-full flex-1 flex-col-reverse'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps='handled'>
          {currentChat?.messages.map((message, index) => (
            <ChatBubble key={`${message.role}-${index}`} chatMessage={message} />
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
              sendMessage(message);
              setMessage('');
            }}>
            <Send className='h-6 w-6 text-primary' />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
