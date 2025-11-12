import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { FileTextIcon, ClipboardIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import * as S from './styles';
import { EditVolunteerModal } from '../modals/EditVolunteerModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { AssessmentModal } from '../modals/AssessmentModal';
import { Voluntario } from '../../../electron/models/voluntario';
import { avaliacaoClient } from '../../services/avaliacaoClient';
import { FormData } from '../forms/assessment';
import ResultadoAvaliacao from '../ResultadoAvaliacao';
import { PopulationContext } from '../../context/population';
import { FilterOptions } from '../modals/FilterModal';

interface VolunteersTableProps {
  setCurrentPage: (page: string) => void;
  showSuccessMessage: (message: string) => void;
  searchTerm?: string;
  filters?: FilterOptions;
  openResumoFisico?: (voluntarioId: number) => void;
  openResultadoAvaliacao?: (voluntarioId: number) => void;
}

export function VolunteerTable({
  setCurrentPage,
  showSuccessMessage,
  searchTerm = "",
  filters,
  openResumoFisico,
  openResultadoAvaliacao,
}: VolunteersTableProps) {
  const [volunteers, setVolunteers] = useState<Voluntario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'delete' | 'assessment' | 'edit' | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Voluntario | null>(null);
  const [showResultado, setShowResultado] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const isFirstLoad = useRef(true);
  const populationContext = useContext(PopulationContext);

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

        const volunteersWithBooleanFlag = fetchedVolunteers.map((v) => ({
          ...v,
          realizouAvaliacao: Boolean(v.realizouAvaliacao),
        }));

        setVolunteers(volunteersWithBooleanFlag);
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
    if (selectedVolunteer && selectedVolunteer.id) {
      try {
        let assessments = await avaliacaoClient.listByVoluntario(selectedVolunteer.id)
        await avaliacaoClient.remove(selectedVolunteer.id)
        await window.api.invoke('voluntario:remove', selectedVolunteer.id);
        setVolunteers(volunteers.filter((v) => v.id !== selectedVolunteer.id));
        showSuccessMessage('Voluntário deletado com sucesso!');
        closeModal();
        populationContext.removeVolunteer(selectedVolunteer)
        populationContext.removeAssessment(assessments[0])
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

  const handleOpenEditModal = (volunteer: Voluntario) => {
    setSelectedVolunteer(volunteer);
    setModal('edit');
  };

  const handleAssessmentSubmit = async (data: FormData) => {
    if(selectedVolunteer){
        let total_blows = data.first_round_blows + data.second_round_blows + data.third_round_total_blows
        let iacap = (data.final_heart_rate + data.heart_rate_after_one_minute)/total_blows
        let power = (total_blows * (selectedVolunteer.peso ?? 0))/1.25
        let fatigue = ((data.first_round_blows - data.third_roud_latest_seconds_blows) * 100)/data.first_round_blows

      let assessment = await avaliacaoClient.create({
        golpes: total_blows,
        iacap,
        potencia: power,
        if_valor:fatigue,
        voluntario_id: selectedVolunteer.id!,
        pse: data.rate_of_perceived_exertion,
            rfc: data.final_heart_rate - data.heart_rate_after_one_minute
      })

      if (assessment) {
            showSuccessMessage('Voluntário avaliado com sucesso!');
            setVolunteers((prev) => prev.map((v) => (
              v.id === selectedVolunteer.id ? { ...v, realizouAvaliacao: true } : v
            )));
            setModal(null); // Fecha o modal de avaliação mas mantém o selectedVolunteer
            setShowResultado(true);
        populationContext.addAssessment(assessment)
      }
    }
  };

  const handleVolunteerUpdateSuccess = (updatedVolunteer: Voluntario) => {
    setVolunteers((prev) => prev.map((volunteer) => (
      volunteer.id === updatedVolunteer.id ? { ...volunteer, ...updatedVolunteer } : volunteer
    )));
    populationContext.updateVolunteer(updatedVolunteer);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedVolunteer(null);
  };

  // Função para extrair anos da string de tempo de prática
  const parseYearsFromTempoPratica = (tempoPratica?: string): number => {
    if (!tempoPratica) return 0

    const tempoStr = String(tempoPratica).trim().toLowerCase()

    const patterns = [
      /(\d+\.?\d*)\s*anos?/,
      /(\d+\.?\d*)\s*years?/,
      /^(\d+\.?\d*)$/,
    ]

    for (const pattern of patterns) {
      const match = tempoStr.match(pattern)
      if (match) {
        const value = parseFloat(match[1])
        return isNaN(value) ? 0 : value
      }
    }

    return 0
  }

  const filteredVolunteers = useMemo(() => {
    if (!filters) return volunteers;

    return volunteers.filter((volunteer) => {
      // Filtro de graduação
      if (filters.graduacao.length > 0 && volunteer.graduacao) {
        if (!filters.graduacao.includes(volunteer.graduacao)) {
          return false;
        }
      }

      // Filtro de avaliação realizada
      if (filters.realizouAvaliacao !== null) {
        const realizou = volunteer.realizouAvaliacao === true;
        if (filters.realizouAvaliacao === 'sim' && !realizou) {
          return false;
        }
        if (filters.realizouAvaliacao === 'nao' && realizou) {
          return false;
        }
      }

      if (filters.tempoPratica !== null) {
        const anos = parseYearsFromTempoPratica(volunteer.tempo_pratica);

        switch (filters.tempoPratica) {
          case 'menos-1':
            if (anos >= 1) return false;
            break;
          case '1-3':
            if (anos < 1 || anos >= 3) return false;
            break;
          case '3-5':
            if (anos < 3 || anos >= 5) return false;
            break;
          case 'mais-5':
            if (anos < 5) return false;
            break;
        }
      }

      return true;
    });
  }, [volunteers, filters]);

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
            {filteredVolunteers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#9aa9b3' }}>
                  Nenhum voluntário encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredVolunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td>{volunteer.apelido}</td>
                  <td>{volunteer.graduacao}</td>
                  <td>{volunteer.tempo_pratica}</td>
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
                      onClick={() => handleOpenEditModal(volunteer)}
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
              ))
            )}
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
      <ResultadoAvaliacao
        isOpen={showResultado}
        onClose={() => {
          setShowResultado(false);
          setSelectedVolunteer(null); // Limpa o voluntário ao fechar o resultado
        }}
        volunteer={selectedVolunteer}
      />
      <EditVolunteerModal
        isOpen={modal === 'edit'}
        volunteerId={selectedVolunteer?.id ?? null}
        onClose={closeModal}
        onSuccess={handleVolunteerUpdateSuccess}
        showSuccessMessage={showSuccessMessage}
      />
    </S.Container>
  );
}

