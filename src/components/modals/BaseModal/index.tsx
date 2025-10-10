import React from 'react';
import { X } from '@phosphor-icons/react';
import * as S from './styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'large';
}

export function Modal({ isOpen, onClose, children, title , size = 'small'}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer size={size} onClick={(e) => e.stopPropagation()}>
        <S.Header>
          {title && <S.Title>{title}</S.Title>}
          <S.CloseButton onClick={onClose}>
            <X size={24} />
          </S.CloseButton>
        </S.Header>
        <S.Content>
          {children}
        </S.Content>
      </S.ModalContainer>
    </S.Overlay>
  );
}