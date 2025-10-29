import React from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import * as S from './styles';
import { Pages } from '../../types/pages';

interface VolunteersPageProps {
    setCurrentPage: (page: Pages) => void;
    openResumoFisico: () => void;
    openResultadoAvaliacao: () => void;
}

// As props `openResumoFisico` e `openResultadoAvaliacao` vêm do App.tsx.
// Elas podem ser usadas no `onClick` de um botão para abrir os modais.
export function VolunteersPage({setCurrentPage, openResumoFisico, openResultadoAvaliacao}:VolunteersPageProps) {
    return (
        <S.Container>
            <Header />
            <VolunteerTable setCurrentPage={setCurrentPage}/>
        </S.Container>
    );
}