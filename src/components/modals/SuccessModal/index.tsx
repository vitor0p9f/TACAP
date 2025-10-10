import React from 'react';
import { Modal } from '../BaseModal';
import * as S from './styles';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.Container>
        <S.Message>{message}</S.Message>
        <S.ContinueButton onClick={onClose}>Continuar</S.ContinueButton>
      </S.Container>
    </Modal>
  );
}