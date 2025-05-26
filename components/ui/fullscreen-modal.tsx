import React from 'react';
import { Modal, ModalProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FullscreenModalProps = Omit<ModalProps, 'children'> & {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function FullscreenModal({ visible, onClose, children, ...modalProps }: FullscreenModalProps) {
  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      onRequestClose={onClose}
      {...modalProps}>
      <SafeAreaView className='flex-1 bg-background'>{children}</SafeAreaView>
    </Modal>
  );
}
