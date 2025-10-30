import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import { SuccessModal } from '../../components/modals/SuccessModal';
import ResumoFisico from '../../components/ResumoFisico';
import ResultadoAvaliacao from '../../components/ResultadoAvaliacao';
import * as S from './styles';
import { Pages } from '../../types/pages';

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

  const handleSeedDatabase = async () => {
    if (
      confirm(
        "Isso irá apagar e recriar todos os dados de teste. Deseja continuar?"
      )
    ) {
      try {
        const result = (await window.api.invoke("database:seed")) as {
          success: boolean;
          message: string;
        };
        if (result.success) {
          alert(result.message);
          window.location.reload(); // Recarrega a página para ver os novos dados
        } else {
          alert(`Erro: ${result.message}`);
        }
      } catch (error) {
        console.error("Erro ao chamar API de seed:", error);
        alert("Ocorreu um erro inesperado. Verifique o console.");
      }
    }
  };

  return (
    <S.Container>
      <Header onExportSuccess={showSuccessMessage} onSearchChange={setSearchTerm} />

      <div style={{ padding: "10px", background: "#fff" }}>
        <button onClick={handleSeedDatabase}>
          [DEV] Popular Banco com Dados Falsos
        </button>
      </div>

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

      <ResultadoAvaliacao
        isOpen={modalResultado.open}
        onClose={() => setModalResultado({open: false, voluntarioId: null})}
        voluntarioId={modalResultado.voluntarioId}
      />
    </S.Container>
  );
}
