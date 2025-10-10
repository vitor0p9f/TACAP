import React from 'react';
import { Modal } from '../BaseModal';
import * as S from './styles';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <S.Container>
        <S.Message>Deletar voluntário?</S.Message>
        <S.ButtonWrapper>
          <S.NoButton onClick={onClose}>Não</S.NoButton>
          <S.YesButton onClick={onConfirm}>Sim</S.YesButton>
        </S.ButtonWrapper>
      </S.Container>
    </Modal>
  );
}