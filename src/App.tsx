import React from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { VolunteersPage } from './pages/VolunteersPage/VolunteersPage';

function App() {
  return (
    <div className="container">
      <Sidebar />
      <VolunteersPage />
    </div>
  );
}

export default App;