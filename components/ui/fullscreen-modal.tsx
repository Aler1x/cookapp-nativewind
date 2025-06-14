import React from 'react';
import { Modal, ModalProps } from 'react-native';
import { View } from '~/components/ui/view';

type FullscreenModalProps = Omit<ModalProps, 'children'> & {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  animationType?: 'slide' | 'fade';
};

export default function FullscreenModal({
  visible,
  onClose,
  children,
  animationType = 'slide',
  presentationStyle = 'fullScreen',
  ...modalProps
}: FullscreenModalProps) {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      onRequestClose={onClose}
      {...modalProps}>
      <View className='flex-1'>{children}</View>
    </Modal>
  );
}
