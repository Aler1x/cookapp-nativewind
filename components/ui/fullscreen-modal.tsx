import React from 'react';
import { Modal, ModalProps } from 'react-native';

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
      {children}
    </Modal>
  );
}
