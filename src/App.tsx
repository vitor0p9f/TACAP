import React, { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/global';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { VolunteersPage } from './pages/VolunteersPage';
import RegistrationForm from './components/forms/registration';
import ResumoFisico from "./components/ResumoFisico";
import ResultadoAvaliacao from "./components/ResultadoAvaliacao";
import DashboardPage from './pages/DashboardPage';
import { Pages } from './types/pages';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: var(--cor-fundo);
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

function App() {
  const [currentPage, setCurrentPage] = useState<Pages>('Volunteers');

  // Modais agora são controlados dentro de VolunteersPage

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <TopBar />
        <MainContent>
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          {currentPage === "Volunteers" && <VolunteersPage setCurrentPage={setCurrentPage} />}
          {currentPage === "Registration" && <RegistrationForm setCurrentPage={setCurrentPage}/>}
          {currentPage === "Dashboard" && <DashboardPage/>}
        </MainContent>
      </AppContainer>
      
      {/* Modais renderizados pela VolunteersPage */}
    </>
  );
}

export default App;