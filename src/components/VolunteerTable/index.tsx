import React, { useState, useEffect, useRef } from 'react';
import { FileTextIcon, ClipboardIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import * as S from './styles';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { AssessmentModal } from '../modals/AssessmentModal';
import { Voluntario } from '../../../electron/models/voluntario';

interface VolunteersTableProps {
  setCurrentPage: (page: string) => void;
  showSuccessMessage: (message: string) => void;
  searchTerm?: string;
  openResumoFisico?: (voluntarioId: number) => void;
  openResultadoAvaliacao?: (voluntarioId: number) => void;
}

export function VolunteerTable({
  setCurrentPage,
  showSuccessMessage,
  searchTerm = "",
  openResumoFisico,
  openResultadoAvaliacao,
}: VolunteersTableProps) {
  const [volunteers, setVolunteers] = useState<Voluntario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'delete' | 'assessment' | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Voluntario | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const isFirstLoad = useRef(true);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 150);
    return () => clearTimeout(id);
  }, [searchTerm]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        if (isFirstLoad.current) setIsLoading(true);
        const fetchedVolunteers = (await window.api.invoke(
          "voluntario:list",
          debouncedSearch
        )) as Voluntario[];
        setVolunteers(fetchedVolunteers);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar voluntários:', err);
        setError('Não foi possível carregar os voluntários.');
      } finally {
        if (isFirstLoad.current) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      }
    };

    fetchVolunteers();
  }, [debouncedSearch]);

  const handleOpenDeleteModal = (volunteer: Voluntario) => {
    setSelectedVolunteer(volunteer);
    setModal('delete');
  };

  const handleConfirmDelete = async () => {
    if (selectedVolunteer) {
      try {
        await window.api.invoke('voluntario:remove', selectedVolunteer.id);
        setVolunteers(volunteers.filter((v) => v.id !== selectedVolunteer.id));
        showSuccessMessage('Voluntário deletado com sucesso!');
        closeModal();
      } catch (err) {
        console.error('Erro ao deletar voluntário:', err);
        alert('Ocorreu um erro ao deletar o voluntário.');
      }
    }
  };

  const handleOpenAssessmentModal = (volunteer: Voluntario) => {
    setSelectedVolunteer(volunteer);
    setModal('assessment');
  };

  const handleAssessmentSubmit = async (data: any) => {
    if (!selectedVolunteer) return;
    try {
      const payload = {
        voluntario_id: selectedVolunteer.id!,
        iacap: 100,
        if_valor: 1.0,
        potencia: Number(data?.third_roud_latest_seconds_blows) || 0,
        rfc: Number(data?.final_heart_rate) || 0,
        pse: Number(data?.rate_of_perceived_exertion) || 0,
        golpes: Number(data?.third_round_total_blows) || 0,
      };
      await window.api.invoke('avaliacao:create', payload);

      setVolunteers(prev => prev.map(v => v.id === selectedVolunteer.id ? { ...v, realizouAvaliacao: true } : v));
      showSuccessMessage('Voluntário avaliado com sucesso!');
      closeModal();

      if (openResultadoAvaliacao && selectedVolunteer.id) {
        openResultadoAvaliacao(selectedVolunteer.id);
      }
    } catch (e) {
      console.error('Erro ao salvar avaliação:', e);
      alert('Erro ao salvar avaliação.');
    }
  };

  const closeModal = () => {
    setModal(null);
    setSelectedVolunteer(null);
  };

  if (isLoading) {
    return <S.Container>Carregando voluntários...</S.Container>;
  }

  if (error) {
    return <S.Container>Erro: {error}</S.Container>;
  }

  return (
    <S.Container>
      <S.TableWrapper>
        <table>
          <thead>
            <tr>
              <th>Apelido</th>
              <th>Graduação</th>
              <th>Tempo de prática</th>
              <th>Realizou avaliação</th>
              <th className="actions-header">Ações</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.apelido}</td>
                <td>{volunteer.graduacao}</td>
                <td>{volunteer.tempo_pratica} ano(s)</td>
                <td>{volunteer.realizouAvaliacao ? 'Sim' : 'Não'}</td>
                <td className="actions-cell">
                  {volunteer.realizouAvaliacao ? (
                    <button
                      title="Resumo físico"
                      aria-label={`Resumo físico de ${volunteer.apelido}`}
                      onClick={() => openResumoFisico && volunteer.id && openResumoFisico(volunteer.id)}
                    >
                      <FileTextIcon size={18} />
                    </button>
                  ) : (
                    <button
                      title="Realizar avaliação"
                      aria-label={`Realizar avaliação de ${volunteer.apelido}`}
                      onClick={() => handleOpenAssessmentModal(volunteer)}
                    >
                      <ClipboardIcon size={18} />
                    </button>
                  )}
                  <button
                    title="Editar"
                    aria-label={`Editar ${volunteer.apelido}`}
                  >
                    <PencilSimpleIcon size={18} />
                  </button>
                  <button
                    title="Excluir"
                    aria-label={`Excluir ${volunteer.apelido}`}
                    onClick={() => handleOpenDeleteModal(volunteer)}
                  >
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </S.TableWrapper>
      <S.Footer>
        <button
          className="add-button"
          onClick={() => setCurrentPage('Registration')}
        >
          Adicionar
        </button>
      </S.Footer>

      <ConfirmDeleteModal
        isOpen={modal === 'delete'}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
      />
      <AssessmentModal
        isOpen={modal === 'assessment'}
        onClose={closeModal}
        onSubmit={handleAssessmentSubmit}
      />
    </S.Container>
  );
}
