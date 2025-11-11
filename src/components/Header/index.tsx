import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, UploadSimpleIcon } from '@phosphor-icons/react';
import * as S from './styles';

interface ExportResult {
  success: boolean;
  message: string;
}

interface HeaderProps {
  onExportSuccess: (message: string) => void;
  onSearchChange?: (term: string) => void;
  onFilterClick?: () => void;
  hasActiveFilters?: boolean;
}

export function Header({ onExportSuccess, onSearchChange, onFilterClick, hasActiveFilters }: HeaderProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };
  const handleExportClick = async () => {
    try {
      console.log("Iniciando exportação...");
      // Chama a função do backend
      const result = (await window.api.invoke("export:csv")) as ExportResult;

      if (result.success) {
        console.log("Exportação bem-sucedida!");
        onExportSuccess(result.message); // Notifica o componente pai
      } else {
        console.error("Falha na exportação:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Erro crítico ao exportar:", error);
    }
  };
  return (
    <S.Container>
      <S.SearchBarWrapper>
        <MagnifyingGlassIcon size={20} />
        <input type="search" placeholder="Busca..." onChange={handleSearchChange} />
      </S.SearchBarWrapper>
      <S.HeaderActions>
        <S.FilterButton 
          title="Filtrar" 
          onClick={onFilterClick}
          $hasActiveFilters={hasActiveFilters}
        >
          <FunnelIcon size={22} />
        </S.FilterButton>
        <button title="Exportar dados para CSV" onClick={handleExportClick}>
          <UploadSimpleIcon size={22} />
        </button>
      </S.HeaderActions>
    </S.Container>
  );
}
