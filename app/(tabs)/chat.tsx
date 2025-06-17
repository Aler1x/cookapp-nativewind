import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator, FlatList, VirtualizedList } from 'react-native';
import ChatBubble from '~/components/chat-bubble';
import { BookOpen, ChefHat, CookingPot, Info, MessageSquarePlus, Send, History, Trash2 } from '~/assets/icons';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const flatListRef = useRef<VirtualizedList<ChatMessage>>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const { sendMessageWithoutAppend, fetchUserChats, createNewChat, loadChatHistory, deleteChatHistory, messages, userChats, currentChat, setMessages } = useChat();

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

  // Typewriter animation function
  const animateMessage = useCallback((fullMessage: string, messageType: 'TEXT' | 'RECIPE_DETAILS' | 'GALLERY' | 'JOB_STATUS' = 'TEXT') => {
    return new Promise<void>((resolve) => {
      setIsAnimating(true);

      // Add empty assistant message that will be updated
      const emptyMessage: ChatMessage = {
        role: 'ASSISTANT',
        content: {
          messageType,
          message: '',
          jobInfo: null,
          recipe: null,
          recipes: null,
        }
      };

      // Add the empty message first
      setMessages(prevMessages => [...prevMessages, emptyMessage]);

      let currentIndex = 0;
      const typeNextChar = () => {
        if (currentIndex <= fullMessage.length) {
          const partialMessage = fullMessage.substring(0, currentIndex);

          // Update the last message with partial content
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];

            if (lastMessage && lastMessage.role === 'ASSISTANT') {
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                content: {
                  messageType,
                  message: partialMessage,
                  jobInfo: null,
                  recipe: null,
                  recipes: null,
                }
              };
            }

            return updatedMessages;
          });

          currentIndex++;

          if (currentIndex <= fullMessage.length) {
            // Random delay between 20-60ms for more natural typing
            const delay = Math.random() * 40 + 20;
            animationRef.current = setTimeout(typeNextChar, delay);
          } else {
            setIsAnimating(false);
            resolve();
          }
        } else {
          setIsAnimating(false);
          resolve();
        }
      };

      // Start the animation
      typeNextChar();
    });
  }, []);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (message.trim() === '' || isLoading || isAnimating) {
      return;
    }

    const userMessage = message.trim();
    setMessage(''); // Clear input immediately to show message was sent
    setIsLoading(true);

    // Add user message immediately
    const userChatMessage: ChatMessage = { role: 'USER', content: userMessage };
    setMessages(prevMessages => [...prevMessages, userChatMessage]);

    try {
      const response = await sendMessageWithoutAppend(userMessage);

      if (response && response.messages && response.messages.length > 0) {
        const assistantMessage = response.messages[0];

        // Handle different message types
        if (typeof assistantMessage.content === 'string') {
          throw new Error('Assistant message is a string, but it should be an object');
        }

        if (assistantMessage.content.messageType === 'TEXT') {
          // Animate text messages
          await animateMessage(assistantMessage.content.message, 'TEXT');
        } else {
          // For non-text messages (recipes, galleries, etc.), add them directly
          setMessages(prevMessages => [...prevMessages, assistantMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message with animation
      await animateMessage('Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading, isAnimating, sendMessageWithoutAppend, animateMessage, setMessages]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUserChats(false); // Don't auto-load last chat on refresh
      // If there's a current chat, reload its messages
      if (currentChat?.chatId) {
        await loadChatHistory(currentChat.chatId);
      }
    } catch (error) {
      console.error('Failed to refresh chat history:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUserChats, loadChatHistory, currentChat?.chatId]);

  const handleChatSelection = async (chatId: string) => {
    setLoadingChatId(chatId);
    try {
      await loadChatHistory(chatId);
      setIsChatSelectorOpen(false);
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      setLoadingChatId(null);
    }
  };

  const handleDeleteChat = async (chatId: string, event: any) => {
    // Prevent triggering chat selection when delete is clicked
    event.stopPropagation();
    
    setDeletingChatId(chatId);
    try {
      await deleteChatHistory(chatId);
    } catch (error) {
      console.error('Failed to delete chat:', error);
    } finally {
      setDeletingChatId(null);
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
        style={{ flex: 1 }}
        behavior={'padding'}        >
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
              {userChats.toReversed().map((chat) => (
                <TouchableOpacity
                  key={chat.chatId}
                  className={`mb-2 rounded-lg border p-4 ${currentChat?.chatId === chat.chatId
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 bg-white'
                    }`}
                  onPress={() => handleChatSelection(chat.chatId)}
                  disabled={loadingChatId !== null || deletingChatId !== null}>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-1'>
                      <Text className='text-sm font-medium'>
                        Chat {chat.chatId.substring(0, 8)}...
                      </Text>
                      <Text className='text-xs text-gray-500'>
                        {formatChatDate(chat.updatedAt)}
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-2'>
                      {deletingChatId === chat.chatId ? (
                        <ActivityIndicator size='small' color={THEME.light.colors.primary} />
                      ) : (
                        <TouchableOpacity
                          className='p-1'
                          onPress={(event) => handleDeleteChat(chat.chatId, event)}
                          disabled={loadingChatId !== null || deletingChatId !== null}>
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </TouchableOpacity>
                      )}
                      {loadingChatId === chat.chatId ? (
                        <ActivityIndicator size='small' color={THEME.light.colors.primary} />
                      ) : currentChat?.chatId === chat.chatId ? (
                        <View className='ml-1 h-2 w-2 rounded-full bg-primary' />
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </BasicModal>

        <VirtualizedList
          ref={flatListRef}
          data={messages}
          getItemCount={() => messages.length}
          getItem={(data, index) => messages[index]}
          renderItem={({ item }) => <ChatBubble chatMessage={item} />}
          keyExtractor={(item: ChatMessage, index: number) => `${item.role}-${index}`}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
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
                animated: true
              });
            } else {
              flatListRef.current?.scrollToEnd({ animated: true });
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

        <View className='w-full flex-row items-end gap-2'>
          <Textarea
            placeholder='Ask me anything about recipes'
            className='flex-1 rounded-lg bg-background p-2'
            value={message}
            numberOfLines={2}
            onChangeText={setMessage}
            editable={!isAnimating && !isLoading}
          />

          <Button
            variant='outline'
            onPress={handleSendMessage}
            disabled={isLoading || isAnimating}>
            {isLoading || isAnimating ? (
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
