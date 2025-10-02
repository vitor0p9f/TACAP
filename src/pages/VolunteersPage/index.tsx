import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { mockVolunteers, Volunteer } from '../../mocks/volunteers';
import { FileTextIcon, ClipboardIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import * as S from './styles';

export function VolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    useEffect(() => {
        // Simula a busca de dados
        setVolunteers(mockVolunteers);
    }, []);

    return (
        <S.Container>
            <Header />
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
                                        <button title="Ver avaliação"><FileTextIcon size={20} /></button>
                                    ) : (
                                        <button title="Realizar avaliação"><ClipboardIcon size={20} /></button>
                                    )}
                                    <button title="Editar"><PencilSimpleIcon size={20} /></button>
                                    <button title="Excluir"><TrashIcon size={20} /></button>
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