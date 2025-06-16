import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatHistoryItem, ChatMessage, ChatResponse } from '~/types/chat';

export interface ChatStore {
  userChats: ChatHistoryItem[];
  messages: ChatMessage[];
  currentChat: ChatResponse | null;

  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      userChats: [],
      messages: [],
      currentChat: null,

      addMessage: (message: ChatMessage) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
