import React, { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/global';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { VolunteersPage } from './pages/VolunteersPage';
import RegistrationForm from './components/forms/registration';
import ResumoFisico from "./components/ResumoFisico";
import ResultadoAvaliacao from "./components/ResultadoAvaliacao";

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
  const [currentPage, setCurrentPage] = useState('Volunteers');
  const [isResumoFisicoOpen, setIsResumoFisicoOpen] = useState(false);
  const [isResultadoAvaliacaoOpen, setIsResultadoAvaliacaoOpen] = useState(false);

  // Funções para controlar os modais, prontas para serem usadas no futuro
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
          <Sidebar />
          {currentPage === "Volunteers" && 
            <VolunteersPage 
              setCurrentPage={setCurrentPage}
              // As funções estão prontas para serem passadas para qualquer
              // componente que precise chamar os modais.
              // openResumoFisico={handleOpenResumoFisico}
              // openResultadoAvaliacao={handleOpenResultadoAvaliacao}
            />
          }
          {currentPage === "Registration" && <RegistrationForm setCurrentPage={setCurrentPage}/>}
        </MainContent>
      </AppContainer>
      
      {/* Seus componentes de modal existem na aplicação, mas começam invisíveis */}
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