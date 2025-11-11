import React, { useState, useEffect } from 'react';
import { XIcon } from '@phosphor-icons/react';
import * as S from './styles';

export interface FilterOptions {
  graduacao: string[];
  realizouAvaliacao: string | null;
  tempoPratica: string | null;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const graduacaoOptions = ['Branca', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'];

export function FilterModal({ isOpen, onClose, onApplyFilter, currentFilters }: FilterModalProps) {
  const [selectedGraduacoes, setSelectedGraduacoes] = useState<string[]>(currentFilters.graduacao);
  const [avaliacaoFilter, setAvaliacaoFilter] = useState<string | null>(currentFilters.realizouAvaliacao);
  const [tempoPraticaFilter, setTempoPraticaFilter] = useState<string | null>(currentFilters.tempoPratica);

  useEffect(() => {
    if (isOpen) {
      setSelectedGraduacoes(currentFilters.graduacao);
      setAvaliacaoFilter(currentFilters.realizouAvaliacao);
      setTempoPraticaFilter(currentFilters.tempoPratica);
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleGraduacaoToggle = (graduacao: string) => {
    setSelectedGraduacoes((prev) =>
      prev.includes(graduacao)
        ? prev.filter((g) => g !== graduacao)
        : [...prev, graduacao]
    );
  };

  const handleClearFilters = () => {
    setSelectedGraduacoes([]);
    setAvaliacaoFilter(null);
    setTempoPraticaFilter(null);
  };

  const handleApply = () => {
    onApplyFilter({
      graduacao: selectedGraduacoes,
      realizouAvaliacao: avaliacaoFilter,
      tempoPratica: tempoPraticaFilter,
    });
    onClose();
  };

  const hasActiveFilters = selectedGraduacoes.length > 0 || avaliacaoFilter !== null || tempoPraticaFilter !== null;

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <h2>Filtrar Voluntários</h2>
          <button onClick={onClose} title="Fechar">
            <XIcon size={24} />
          </button>
        </S.Header>

        <S.Content>
          <S.FilterSection>
            <S.SectionTitle>Graduação</S.SectionTitle>
            <S.CheckboxGroup>
              {graduacaoOptions.map((graduacao) => (
                <S.CheckboxLabel key={graduacao}>
                  <input
                    type="checkbox"
                    checked={selectedGraduacoes.includes(graduacao)}
                    onChange={() => handleGraduacaoToggle(graduacao)}
                  />
                  <span>{graduacao}</span>
                </S.CheckboxLabel>
              ))}
            </S.CheckboxGroup>
          </S.FilterSection>

          <S.FilterSection>
            <S.SectionTitle>Status de Avaliação</S.SectionTitle>
            <S.RadioGroup>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="avaliacao"
                  checked={avaliacaoFilter === null}
                  onChange={() => setAvaliacaoFilter(null)}
                />
                <span>Todos</span>
              </S.RadioLabel>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="avaliacao"
                  checked={avaliacaoFilter === 'sim'}
                  onChange={() => setAvaliacaoFilter('sim')}
                />
                <span>Realizaram avaliação</span>
              </S.RadioLabel>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="avaliacao"
                  checked={avaliacaoFilter === 'nao'}
                  onChange={() => setAvaliacaoFilter('nao')}
                />
                <span>Não realizaram avaliação</span>
              </S.RadioLabel>
            </S.RadioGroup>
          </S.FilterSection>

          <S.FilterSection>
            <S.SectionTitle>Tempo de Prática</S.SectionTitle>
            <S.RadioGroup>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="tempoPratica"
                  checked={tempoPraticaFilter === null}
                  onChange={() => setTempoPraticaFilter(null)}
                />
                <span>Todos</span>
              </S.RadioLabel>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="tempoPratica"
                  checked={tempoPraticaFilter === 'menos-1'}
                  onChange={() => setTempoPraticaFilter('menos-1')}
                />
                <span>Menos de 1 ano</span>
              </S.RadioLabel>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="tempoPratica"
                  checked={tempoPraticaFilter === '1-3'}
                  onChange={() => setTempoPraticaFilter('1-3')}
                />
                <span>1 a 3 anos</span>
              </S.RadioLabel>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="tempoPratica"
                  checked={tempoPraticaFilter === '3-5'}
                  onChange={() => setTempoPraticaFilter('3-5')}
                />
                <span>3 a 5 anos</span>
              </S.RadioLabel>
              <S.RadioLabel>
                <input
                  type="radio"
                  name="tempoPratica"
                  checked={tempoPraticaFilter === 'mais-5'}
                  onChange={() => setTempoPraticaFilter('mais-5')}
                />
                <span>Mais de 5 anos</span>
              </S.RadioLabel>
            </S.RadioGroup>
          </S.FilterSection>
        </S.Content>

        <S.Footer>
          <S.ClearButton onClick={handleClearFilters} disabled={!hasActiveFilters}>
            Limpar filtros
          </S.ClearButton>
          <S.ApplyButton onClick={handleApply}>
            Aplicar filtros
          </S.ApplyButton>
        </S.Footer>
      </S.Modal>
    </S.Overlay>
  );
}

