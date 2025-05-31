import { Modal, Pressable } from 'react-native';
import React from 'react';

interface BasicModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'none';
}

export default function BasicModal({ isModalOpen, setIsModalOpen, children, animationType = 'fade' }: BasicModalProps) {
  return (
    <Modal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false);
      }}
      onAccessibilityEscape={() => setIsModalOpen(false)}
      animationType={animationType}
      transparent={true}>
      <Pressable className='flex-1 bg-black/50 justify-end' onPress={() => setIsModalOpen(false)}>
        <Pressable
          className='bg-background rounded-t-2xl w-full shadow-2xl p-6 max-h-[80%]'
          onPress={() => { }}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
