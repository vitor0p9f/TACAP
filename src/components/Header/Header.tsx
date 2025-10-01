import React from 'react';
import { Search, Filter, Upload } from 'lucide-react';

export function Header() {
  return (
    <header className="main-header">
      <div className="search-bar">
        <Search className="search-icon" size={20} />
        <input type="search" placeholder="Busca..." />
      </div>
      <div className="header-actions">
        <button title="Filtrar">
          <Filter size={24} />
        </button>
        <button title="Importar dados">
          <Upload size={24} />
        </button>
      </div>
    </header>
  );
}
