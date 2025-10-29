import React, { useState } from 'react';
import { Volunteer } from '../../services/voluntarioClient';
import { FileTextIcon, ClipboardIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import * as S from './styles';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { SuccessModal } from '../modals/SuccessModal';
import { AssessmentModal } from '../modals/AssessmentModal';
import { Pages } from '../../types/pages';

interface VolunteersTableProps {
    volunteers: Volunteer[];
    setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
    setCurrentPage: (page: Pages) => void;
    openResumoFisico: () => void;
    openResultadoAvaliacao: () => void;
    handleGoToEdit: (volunteer: Volunteer) => void;
}

export function VolunteerTable({ volunteers, setVolunteers, setCurrentPage, openResumoFisico, openResultadoAvaliacao, handleGoToEdit }: VolunteersTableProps) {
    const [modal, setModal] = useState<'delete' | 'success' | 'assessment' | null>(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleOpenDeleteModal = (volunteer: Volunteer) => {
        setSelectedVolunteer(volunteer);
        setModal('delete');
    };

    const handleConfirmDelete = () => {
        if (selectedVolunteer) {
            console.log('Deletando voluntário:', selectedVolunteer.apelido);
            // Atualiza a lista principal no componente pai
            setVolunteers(prevVolunteers => prevVolunteers.filter(v => v.id !== selectedVolunteer.id));
            setSuccessMessage('Voluntário deletado com sucesso!');
            setModal('success');
        }
    };

    const handleOpenAssessmentModal = (volunteer: Volunteer) => {
        setSelectedVolunteer(volunteer);
        setModal('assessment');
    };

    const handleAssessmentSubmit = (data: any) => {
        console.log('Dados da avaliação:', data);
        console.log('Para o voluntário:', selectedVolunteer?.apelido);
        // Aqui adicionar a chamada de API para salvar a avaliação
        closeModal(); // Fecha o modal de avaliação
        openResumoFisico(); // Abre o modal de resumo físico
    };

    const closeModal = () => {
        setModal(null);
        setSelectedVolunteer(null);
    };

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
                                <td>{volunteer.tempoDePratica}</td>
                                <td>{volunteer.realizouAvaliacao ? 'Sim' : 'Não'}</td>
                                <td className="actions-cell">
                                    {volunteer.realizouAvaliacao ? (
                                        <button title="Ver avaliação" aria-label={`Ver avaliação ${volunteer.apelido}`} onClick={openResultadoAvaliacao}>
                                            <FileTextIcon size={18} />
                                        </button>
                                    ) : (
                                        <button title="Realizar avaliação" aria-label={`Realizar avaliação ${volunteer.apelido}`} onClick={() => handleOpenAssessmentModal(volunteer)}>
                                            <ClipboardIcon size={18} />
                                        </button>
                                    )}
                                    <button title="Editar" aria-label={`Editar ${volunteer.apelido}`} onClick={() => handleGoToEdit(volunteer)}>
                                        <PencilSimpleIcon size={18} />
                                    </button>
                                    <button title="Excluir" aria-label={`Excluir ${volunteer.apelido}`} onClick={() => handleOpenDeleteModal(volunteer)}>
                                        <TrashIcon size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </S.TableWrapper>

            <S.Footer>
                <button className="add-button" onClick={() => setCurrentPage("Registration")}>Adicionar</button>
            </S.Footer>
            
            <ConfirmDeleteModal
                isOpen={modal === 'delete'}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
            />
            <SuccessModal
                isOpen={modal === 'success'}
                onClose={closeModal}
                message={successMessage}
            />
            <AssessmentModal
                isOpen={modal === 'assessment'}
                onClose={closeModal}
                onSubmit={handleAssessmentSubmit}
            />
        </S.Container>
    );
}