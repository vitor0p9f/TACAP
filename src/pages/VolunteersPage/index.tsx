import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import { SuccessModal } from '../../components/modals/SuccessModal';
import ResumoFisico from '../../components/ResumoFisico';
import { FilterModal, FilterOptions } from '../../components/modals/FilterModal';
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    graduacao: [],
    realizouAvaliacao: null,
    tempoPratica: null,
  });
  const [filteredIds, setFilteredIds] = useState<number[]>([]);
  const isDevelopment = import.meta.env.DEV;

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleSeedDatabase = async () => {
    const confirmed = window.confirm(
      'Isso irá apagar e recriar todos os dados de teste. Deseja continuar?'
    );

    if (!confirmed) return;

    try {
      const response = await window.api.invoke('database:seed') as { success: boolean; message: string };

      if (response?.success) {
        alert(response.message);
        window.location.reload();
      } else {
        alert(`Erro: ${response?.message ?? 'Não foi possível popular o banco.'}`);
      }
    } catch (error) {
      console.error('Erro ao chamar API de seed:', error);
      alert('Ocorreu um erro inesperado. Verifique o console.');
    }
  };

  const handleApplyFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = filters.graduacao.length > 0 || 
    filters.realizouAvaliacao !== null ||
    filters.tempoPratica !== null;

  return (
    <S.Container>
      <Header
        onExportSuccess={showSuccessMessage}
        onSearchChange={setSearchTerm}
        onFilterClick={() => setIsFilterModalOpen(true)}
        hasActiveFilters={hasActiveFilters}
        filteredIds={filteredIds}
      />

      {isDevelopment && (
        <div style={{ padding: '10px', background: '#fff' }}>
          <button onClick={handleSeedDatabase}>[DEV] Popular Banco com Dados Falsos</button>
        </div>
      )}

      <VolunteerTable
        setCurrentPage={setCurrentPage}
        showSuccessMessage={showSuccessMessage}
        searchTerm={searchTerm}
        filters={filters}
        openResumoFisico={(id: number) =>
          setModalResumo({ open: true, voluntarioId: id })
        }
        openResultadoAvaliacao={(id: number) =>
          setModalResultado({ open: true, voluntarioId: id })
        }
        onFilteredDataChange={setFilteredIds}
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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilter={handleApplyFilter}
        currentFilters={filters}
      />
    </S.Container>
  );
}
