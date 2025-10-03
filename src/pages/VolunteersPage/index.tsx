import React from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable'; // <-- Importe o novo componente
import * as S from './styles';

export function VolunteersPage() {
    return (
        <S.Container>
            <Header />
            <VolunteerTable /> {/* <-- Use o novo componente aqui */}
        </S.Container>
    );
}