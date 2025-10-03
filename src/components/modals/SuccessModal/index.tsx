import React from 'react';
import { BaseModal } from '../BaseModal';
import * as S from './styles';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <S.Container>
        <S.Title>Voluntário cadastrado com sucesso!</S.Title>
        <S.ContinueButton onClick={onClose}>CONTINUAR</S.ContinueButton>
      </S.Container>
    </BaseModal>
  );
}