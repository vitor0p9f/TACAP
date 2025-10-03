import React from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import * as S from './styles';

export function VolunteersPage() {
    return (
        <S.Container>
            <Header />
            <VolunteerTable /> {}
        </S.Container>
    );
}