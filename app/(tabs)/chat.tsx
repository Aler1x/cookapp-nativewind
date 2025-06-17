import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native';
import ChatBubble from '~/components/chat-bubble';
import { BookOpen, ChefHat, CookingPot, Info, MessageSquarePlus, Send } from '~/assets/icons';
import { Textarea } from '~/components/ui/textarea';
import { SafeAreaView } from 'react-native-safe-area-context';
import BasicModal from '~/components/ui/basic-modal';
import HelpModal, { Option } from '~/components/modals/information';
import { useChat } from '~/hooks/useChat';
import { useAuth } from '@clerk/clerk-expo';
import AuthPage from '~/components/pages/auth';
import { THEME } from '~/lib/constants';
import { ChatMessage } from '~/types/chat';

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
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const { sendMessage, fetchUserChats, createNewChat, messages } = useChat();

  useEffect(() => {
    if (isSignedIn) {
      fetchUserChats();
    }
  }, [fetchUserChats, isSignedIn]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        // Use scrollToOffset for better web compatibility
        if (Platform.OS === 'web') {
          flatListRef.current?.scrollToOffset({
            offset: contentHeight,
            animated: true
          });
        } else {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }, 50);
    }
  }, [messages, contentHeight]);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() === '' || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendMessage(message);
      console.log(response);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setMessage('');
      setIsLoading(false);
    }
  }, [message, isLoading, sendMessage]);

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

            <TouchableOpacity
              className='p-2'
              onPress={() => {
                setIsModalOpen(true);
              }}>
              <Info className='h-8 w-8' />
            </TouchableOpacity>
          </View>
        </View>

        <BasicModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <HelpModal title='What can I do for you?' options={CHAT_HELP_OPTIONS} onClose={() => setIsModalOpen(false)} />
        </BasicModal>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <ChatBubble chatMessage={item} />}
          keyExtractor={(item: ChatMessage, index: number) => `${item.role}-${index}`}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          onContentSizeChange={(width, height) => {
            setContentHeight(height);
            if (Platform.OS === 'web') {
              flatListRef.current?.scrollToOffset({
                offset: height,
                animated: true
              });
            } else {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          onLayout={() => {
            if (Platform.OS === 'web') {
              flatListRef.current?.scrollToOffset({
                offset: contentHeight,
                animated: false
              });
            } else {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onScrollToIndexFailed={() => {
            if (Platform.OS === 'web') {
              flatListRef.current?.scrollToOffset({
                offset: contentHeight,
                animated: true
              });
            } else {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />

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
            onPress={handleSendMessage}>
            {isLoading ? (
              <ActivityIndicator size='small' color={THEME.light.colors.primary} />
            ) : (
              <Send className='h-6 w-6 text-primary' />
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
