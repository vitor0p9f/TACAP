import React from 'react';
import { BaseModal } from '../BaseModal';
import * as S from './styles';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <S.Container>
        <S.Title>Deletar voluntário?</S.Title>
        <S.ButtonWrapper>
          <S.NoButton onClick={onClose}>Não</S.NoButton>
          <S.YesButton onClick={onConfirm}>Sim</S.YesButton>
        </S.ButtonWrapper>
      </S.Container>
    </BaseModal>
  );
}