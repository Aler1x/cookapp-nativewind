import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native';
import ChatBubble from '~/components/chat-bubble';
import { BookOpen, ChefHat, CookingPot, Info, MessageSquarePlus, Send, MessageCircle, History } from '~/assets/icons';
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
  const [isChatSelectorOpen, setIsChatSelectorOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const { sendMessage, fetchUserChats, createNewChat, loadChatHistory, messages, userChats, currentChat } = useChat();

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

    const userMessage = message.trim();
    setMessage(''); // Clear input immediately to show message was sent
    setIsLoading(true);
    
    try {
      const response = await sendMessage(userMessage);
      console.log(response);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading, sendMessage]);

  const handleChatSelection = async (chatId: string) => {
    try {
      await loadChatHistory(chatId);
      setIsChatSelectorOpen(false);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

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
                setIsChatSelectorOpen(true);
              }}>
              <History className='h-8 w-8' />
            </TouchableOpacity>

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

        {/* Chat Selector Modal */}
        <BasicModal isModalOpen={isChatSelectorOpen} setIsModalOpen={setIsChatSelectorOpen}>
          <View className='max-h-96'>
            <Text className='mb-4 text-lg font-semibold'>Select a Chat</Text>
            <ScrollView>
              {userChats.map((chat) => (
                <TouchableOpacity
                  key={chat.chatId}
                  className={`mb-2 rounded-lg border p-4 ${
                    currentChat?.chatId === chat.chatId 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => handleChatSelection(chat.chatId)}>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-1'>
                      <Text className='text-sm font-medium'>
                        Chat {chat.chatId.substring(0, 8)}...
                      </Text>
                      <Text className='text-xs text-gray-500'>
                        {formatChatDate(chat.updatedAt)}
                      </Text>
                    </View>
                    {currentChat?.chatId === chat.chatId && (
                      <View className='ml-2 h-2 w-2 rounded-full bg-primary' />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
