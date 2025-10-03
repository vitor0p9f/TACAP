import React from 'react';
import { X } from '@phosphor-icons/react';
import * as S from './styles';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Conteúdo a ser exibido dentro do modal
}

export function BaseModal({ isOpen, onClose, children }: BaseModalProps) {
  if (!isOpen) {
    return null;
  }

  // e.stopPropagation() para evitar que o clique no modal feche-o
  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>
          <X size={20} />
        </S.CloseButton>
        {children}
      </S.ModalContent>
    </S.Overlay>
  );
}