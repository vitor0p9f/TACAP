import React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './styles/global';
import { Sidebar } from './components/Sidebar';
import { VolunteersPage } from './pages/VolunteersPage';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Sidebar />
        <VolunteersPage />
      </AppContainer>
    </>
  );
}

export default App;