import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import ChatBubble from '~/components/ui/chat-bubble';
import { Info, Send } from '~/assets/icons';
import ChatWhatICan from '~/components/modals/chat-what-i-can';
import { Textarea } from '~/components/ui/textarea';
import { Message } from '~/types/chat';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: 'Hello, how are you?',
      isUser: false,
    },
    {
      id: 2,
      message: 'I am fucked, thank you!',
      isUser: true,
    },
  ]);

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1, height: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className='w-full flex-row items-center justify-center p-4 border-b border-border'>
          <Text className='text-2xl font-bold text-center'>
            AI Chef
          </Text>

          <TouchableOpacity
            className='p-2 absolute right-4'
            onPress={() => {
              setIsModalOpen(true);
            }}
          >
            <Info className='w-8 h-8' />
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalOpen}
          onRequestClose={() => {
            setIsModalOpen(false);
          }}
          animationType='fade'
          transparent={true}
        >
          <ChatWhatICan onClose={() => setIsModalOpen(false)} />
        </Modal>

        <ScrollView 
          className='flex-1 px-4 w-full flex-col-reverse'
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps='handled'
        >
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message.message} isUser={message.isUser} />
          ))}
        </ScrollView>

        <View className='flex-row items-end gap-2 px-4 w-full mb-4'>
          <Textarea
            placeholder='Ask me anything about recipes'
            className='flex-1 bg-background rounded-lg p-2'
            value={message}
            numberOfLines={2}
            onChangeText={setMessage}
          />

          <Button
            className='rounded-lg'
            onPress={() => {
              setMessages([...messages, {
                id: messages.length + 1,
                message: message,
                isUser: true,
              }]);
              setMessage('');
            }}>
            <Send className='w-6 h-6 text-white' />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
