import React from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import * as S from './styles';

interface VolunteersPageProps {
    setCurrentPage: (page: string) => void;
    openResumoFisico: () => void;
    openResultadoAvaliacao: () => void;
}

export function VolunteersPage({setCurrentPage, openResumoFisico, openResultadoAvaliacao}:VolunteersPageProps) {
    return (
        <S.Container>
            <Header />
            {/* Aqui seria um bom lugar para adicionar os botões de teste no futuro */}
            <VolunteerTable setCurrentPage={setCurrentPage}/>
        </S.Container>
    );
}