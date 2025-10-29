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

  // State e handlers para controlar os modais de gráfico.
  const [isResumoFisicoOpen, setIsResumoFisicoOpen] = useState(false);
  const [isResultadoAvaliacaoOpen, setIsResultadoAvaliacaoOpen] = useState(false);
  const handleOpenResumoFisico = () => setIsResumoFisicoOpen(true);
  const handleCloseResumoFisico = () => setIsResumoFisicoOpen(false);
  const handleOpenResultadoAvaliacao = () => setIsResultadoAvaliacaoOpen(true);
  const handleCloseResultadoAvaliacao = () => setIsResultadoAvaliacaoOpen(false);

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
          {currentPage === "Volunteers" && 
            // Passa as funções para a VolunteersPage conseguir abrir os modais.
            <VolunteersPage
              setCurrentPage={setCurrentPage}
              openResumoFisico={handleOpenResumoFisico}
              openResultadoAvaliacao={handleOpenResultadoAvaliacao}
            />
          }
          {currentPage === "Registration" && <RegistrationForm setCurrentPage={setCurrentPage}/>}
          {currentPage === "Dashboard" && <DashboardPage/>}
        </MainContent>
      </AppContainer>
      
      {/* Renderiza os modais aqui para que possam ser abertos por qualquer página. */}
      <ResumoFisico 
          isOpen={isResumoFisicoOpen} 
          onClose={handleCloseResumoFisico} 
      />
      
      <ResultadoAvaliacao 
          isOpen={isResultadoAvaliacaoOpen} 
          onClose={handleCloseResultadoAvaliacao} 
      />
    </>
  );
}

export default App;