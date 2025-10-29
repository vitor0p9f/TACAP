import React, { useState, useEffect } from 'react';
import { FileTextIcon, ClipboardIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import * as S from './styles';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { AssessmentModal } from '../modals/AssessmentModal';
import { Voluntario } from '../../../electron/models/voluntario';

interface VolunteersTableProps {
  setCurrentPage: (page: string) => void;
  showSuccessMessage: (message: string) => void;
}

export function VolunteerTable({
  setCurrentPage,
  showSuccessMessage,
}: VolunteersTableProps) {
  type VolunteerWithStatus = Voluntario & { realizouAvaliacao: boolean };

  const [volunteers, setVolunteers] = useState<VolunteerWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<'delete' | 'assessment' | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] =
    useState<VolunteerWithStatus | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const fetchedVolunteers = (await window.api.invoke(
          "voluntario:list"
        )) as Voluntario[];

        // --- PONTO IMPORTANTE ---
        // O backend não nos diz se a avaliação foi feita.
        // Por enquanto, vamos simular isso. O ideal seria o backend já enviar essa informação.
        const volunteersWithStatus = fetchedVolunteers.map((v) => ({
          ...v,
          realizouAvaliacao: false, // TODO: A lógica real precisa ser implementada
        }));

        setVolunteers(volunteersWithStatus);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar voluntários:', err);
        setError('Não foi possível carregar os voluntários.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleOpenDeleteModal = (volunteer: VolunteerWithStatus) => {
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

  const handleOpenAssessmentModal = (volunteer: VolunteerWithStatus) => {
    setSelectedVolunteer(volunteer);
    setModal('assessment');
  };

  const handleAssessmentSubmit = (data: any) => {
    console.log('Dados da avaliação:', data);
    console.log('Para o voluntário:', selectedVolunteer?.apelido);
    showSuccessMessage('Voluntário avaliado com sucesso!');
    closeModal();
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
                      title="Ver avaliação"
                      aria-label={`Ver avaliação de ${volunteer.apelido}`}
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
