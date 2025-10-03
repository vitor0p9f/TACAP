import React, { useState, useEffect } from 'react';
import { mockVolunteers, Volunteer } from '../../mocks/volunteers';
import { FileText, Clipboard, PencilSimple, Trash } from '@phosphor-icons/react';
import * as S from './styles';

export function VolunteerTable() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    useEffect(() => {
        setVolunteers(mockVolunteers);
    }, []);

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
                            <th>Ações</th>
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
                                        <button title="Ver avaliação"><FileText size={20} /></button>
                                    ) : (
                                        <button title="Realizar avaliação"><Clipboard size={20} /></button>
                                    )}
                                    <button title="Editar"><PencilSimple size={20} /></button>
                                    <button title="Excluir"><Trash size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </S.TableWrapper>

            <S.Footer>
                <button className="add-button">Adicionar</button>
            </S.Footer>
        </S.Container>
    );
}