import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { VolunteerTable } from '../../components/VolunteerTable';
import * as S from './styles';
import { voluntarioClient, Volunteer } from '../../services/voluntarioClient';
import { Pages } from '../../types/pages';

interface VolunteersPageProps {
    setCurrentPage: (page: Pages) => void;
    openResumoFisico: () => void;
    openResultadoAvaliacao: () => void;
}

export function VolunteersPage({setCurrentPage, openResumoFisico, openResultadoAvaliacao}:VolunteersPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);

    useEffect(() => {
        voluntarioClient.list().then(setVolunteers);
    }, []);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = volunteers.filter(volunteer =>
            volunteer.apelido.toLowerCase().includes(lowerCaseSearchTerm) ||
            volunteer.graduacao.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredVolunteers(filtered);
    }, [searchTerm, volunteers]);

    return (
        <S.Container>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <VolunteerTable 
                volunteers={filteredVolunteers} 
                setVolunteers={setVolunteers} 
                setCurrentPage={setCurrentPage}
                openResumoFisico={openResumoFisico}
                openResultadoAvaliacao={openResultadoAvaliacao}
            />
        </S.Container>
    );
}