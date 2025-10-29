import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import { SuccessModal } from '../../components/modals/SuccessModal';
import * as S from './styles';
import { Pages } from '../../types/pages';

interface VolunteersPageProps {
  setCurrentPage: (page: string) => void;
  openResumoFisico: () => void;
  openResultadoAvaliacao: () => void;
}

// As props `openResumoFisico` e `openResultadoAvaliacao` vêm do App.tsx.
// Elas podem ser usadas no `onClick` de um botão para abrir os modais.
export function VolunteersPage({
  setCurrentPage,
  openResumoFisico,
  openResultadoAvaliacao,
}: VolunteersPageProps) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <S.Container>
      <Header />

      <VolunteerTable
        setCurrentPage={setCurrentPage}
        showSuccessMessage={showSuccessMessage}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message={successMessage}
      />
    </S.Container>
  );
}
