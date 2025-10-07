import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import * as S from './styles';

export function Header() {
  return (
    <S.Container>
      <S.SearchBarWrapper>
        <MagnifyingGlassIcon size={20} />
        <input type="search" placeholder="Busca..." />
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