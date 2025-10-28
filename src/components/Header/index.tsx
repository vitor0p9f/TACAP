import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import * as S from './styles';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  return (
    <S.Container>
      <S.SearchBarWrapper>
        <MagnifyingGlassIcon size={20} />
        <input
          type="search"
          placeholder="Busca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </S.SearchBarWrapper>
      <S.HeaderActions>
        <button title="Filtrar">
          <FunnelIcon size={22} />
        </button>
        <button title="Importar dados">
          <UploadSimpleIcon size={22} />
        </button>
      </S.HeaderActions>
    </S.Container>
  );
}