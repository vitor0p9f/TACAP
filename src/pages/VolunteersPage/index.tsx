import React from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import * as S from './styles';

interface VolunteersPageProps {
    setCurrentPage: (page: string) => void
}

export function VolunteersPage({setCurrentPage}:VolunteersPageProps) {
    return (
        <S.Container>
            <Header />
            <VolunteerTable setCurrentPage={setCurrentPage}/> {}
        </S.Container>
    );
}