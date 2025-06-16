import { useChatStore } from "~/stores/chat";
import { API_ENDPOINTS_PREFIX } from "~/lib/constants";
import { useCallback, useEffect } from "react";
import { useFetch } from "~/hooks/useFetch";
import { ChatHistoryItem, ChatResponse } from "~/types/chat";

export const useChat = () => {
  const $fetch = useFetch();

  const { currentChat, addMessage } = useChatStore();

  const fetchUserChats = useCallback(async () => {
    const response = await $fetch<ChatHistoryItem[]>(`${API_ENDPOINTS_PREFIX.spring}/chat-history`);
    useChatStore.setState({ userChats: response });
    return response;
  }, [$fetch]);

  const createNewChat = useCallback(async () => {
    const response = await $fetch<ChatResponse>(`${API_ENDPOINTS_PREFIX.spring}/chat-history/initial`);
    console.log('new chat', response);
    useChatStore.setState({ currentChat: response });
    return response;
  }, [$fetch]);

  const sendMessage = useCallback(async (message: string) => {
    console.log('send message', message, currentChat);

    if (!currentChat?.chatId) {
      const newChat = await createNewChat();
      useChatStore.setState({ currentChat: newChat });
      return newChat;
    }

    const response = await $fetch<ChatResponse>(`${API_ENDPOINTS_PREFIX.spring}/chat`, {
      method: 'POST',
      body: JSON.stringify({
        chatId: currentChat.chatId,
        request: message,
      }),
    });

    addMessage(response.messages[response.messages.length - 1]);

    return response;
  }, [currentChat, createNewChat, $fetch, addMessage]);

  return {
    fetchUserChats,
    createNewChat,
    sendMessage,
  };
};