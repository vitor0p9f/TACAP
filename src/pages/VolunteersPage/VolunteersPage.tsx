import React from 'react';
import { Header } from '../../components/Header/Header';
import { VolunteerTable } from '../../components/VolunteerTable/VolunteerTable';

export function VolunteersPage() {
    return (
        <main className="main-content">
            <Header />
            <VolunteerTable />
            <footer className="main-footer">
                <button className="add-button">Adicionar</button>
            </footer>
        </main>
    );
}