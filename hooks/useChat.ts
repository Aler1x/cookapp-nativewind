import { API_ENDPOINTS_PREFIX } from "~/lib/constants";
import { useCallback, useEffect, useState } from "react";
import { useFetch } from "~/hooks/useFetch";
import { ChatHistoryItem, ChatMessage, ChatResponse } from "~/types/chat";
import Toast from "react-native-toast-message";

export const useChat = () => {
  const [currentChat, setCurrentChat] = useState<ChatResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userChats, setUserChats] = useState<ChatHistoryItem[]>([]);

  const $fetch = useFetch();

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  const loadChatHistory = useCallback(async (chatId: string) => {
    const response = await $fetch<ChatResponse>(`${API_ENDPOINTS_PREFIX.spring}/chat-history/${chatId}`);
    setCurrentChat(response);
    setMessages(response.messages);
    return response;
  }, [$fetch]);

  const fetchUserChats = useCallback(async (autoLoadLast = true) => {
    const response = await $fetch<ChatHistoryItem[]>(`${API_ENDPOINTS_PREFIX.spring}/chat-history`);
    setUserChats(response);
    if (response.length > 0 && autoLoadLast) {
      loadChatHistory(response[response.length - 1].chatId);
    }
  }, [$fetch, loadChatHistory]);

  const createNewChat = useCallback(async () => {
    const response = await $fetch<ChatResponse>(`${API_ENDPOINTS_PREFIX.spring}/chat-history/initial`);
    setCurrentChat(response);
    setMessages(response.messages);
    return response;
  }, [$fetch]);

  const sendMessage = useCallback(async (message: string) => {
    if (!currentChat?.chatId) {
      Toast.show({
        type: 'error',
        text1: 'No active chat',
        text2: 'Please create a new chat (use the button on the top right corner)',
      });
      return;
    }

    appendMessage({ role: 'USER', content: message } as ChatMessage);

    try {
      const response = await $fetch<ChatResponse>(`${API_ENDPOINTS_PREFIX.spring}/chat`, {
        method: 'POST',
        body: JSON.stringify({
          chatId: currentChat?.chatId,
          request: message,
        }),
      });

      // Validate response
      if (!response || !response.messages || !Array.isArray(response.messages) || response.messages.length === 0) {
        throw new Error('Invalid response from server');
      }

      // response contains only last message
      appendMessage(response.messages[0] as ChatMessage);

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      appendMessage({
        role: 'ASSISTANT',
        content: {
          messageType: 'TEXT',
          message: 'Sorry, I encountered an error processing your request. Please try again.',
        }
      } as ChatMessage);

      Toast.show({
        type: 'error',
        text1: 'Message failed',
        text2: 'Please check your connection and try again',
      });

      throw error; // Re-throw so the UI can handle loading state
    }
  }, [$fetch, currentChat, appendMessage]);

  const sendMessageWithoutAppend = useCallback(async (message: string) => {
    if (!currentChat?.chatId) {
      Toast.show({
        type: 'error',
        text1: 'No active chat',
        text2: 'Please create a new chat (use the button on the top right corner)',
      });
      return;
    }

    try {
      const response = await $fetch<ChatResponse>(`${API_ENDPOINTS_PREFIX.spring}/chat`, {
        method: 'POST',
        body: JSON.stringify({
          chatId: currentChat?.chatId,
          request: message,
        }),
      }, 120000);

      // Validate response
      if (!response || !response.messages || !Array.isArray(response.messages) || response.messages.length === 0) {
        throw new Error('Invalid response from server');
      }

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Message failed',
        text2: 'Please check your connection and try again',
      });

      throw error; // Re-throw so the UI can handle loading state
    }
  }, [$fetch, currentChat]);

  return {
    // actions
    fetchUserChats,
    createNewChat,
    sendMessage,
    sendMessageWithoutAppend,
    loadChatHistory,
    setMessages,

    // state
    currentChat,
    messages,
    userChats,
  };
};