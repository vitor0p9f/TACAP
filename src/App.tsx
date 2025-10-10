import React, { useState } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/global';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { VolunteersPage } from './pages/VolunteersPage';
import RegistrationForm from './components/forms/registration';

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
  const [currentPage, setCurrentPage] = useState('Volunteers')

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <TopBar />
        <MainContent>
          <Sidebar />
          {currentPage === "Volunteers" && <VolunteersPage setCurrentPage={setCurrentPage}/>}
          {currentPage === "Registration" && <RegistrationForm setCurrentPage={setCurrentPage}/>}
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App;