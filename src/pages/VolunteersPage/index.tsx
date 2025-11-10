import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import { SuccessModal } from '../../components/modals/SuccessModal';
import ResumoFisico from '../../components/ResumoFisico';
import * as S from './styles';

interface VolunteersPageProps {
  setCurrentPage: (page: string) => void;
}

// As props `openResumoFisico` e `openResultadoAvaliacao` vêm do App.tsx.
// Elas podem ser usadas no `onClick` de um botão para abrir os modais.
export function VolunteersPage({
  setCurrentPage,
}: VolunteersPageProps) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalResumo, setModalResumo] = useState<{open: boolean, voluntarioId: number | null}>({open: false, voluntarioId: null});
  const [modalResultado, setModalResultado] = useState<{open: boolean, voluntarioId: number | null}>({open: false, voluntarioId: null});

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <S.Container>
      <Header onExportSuccess={showSuccessMessage} onSearchChange={setSearchTerm} />

      <VolunteerTable
        setCurrentPage={setCurrentPage}
        showSuccessMessage={showSuccessMessage}
        searchTerm={searchTerm}
        openResumoFisico={(id: number) => setModalResumo({open: true, voluntarioId: id})}
        openResultadoAvaliacao={(id: number) => setModalResultado({open: true, voluntarioId: id})}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message={successMessage}
      />

      <ResumoFisico
        isOpen={modalResumo.open}
        onClose={() => setModalResumo({open: false, voluntarioId: null})}
        voluntarioId={modalResumo.voluntarioId}
      />
    </S.Container>
  );
}