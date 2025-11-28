import styled from 'styled-components';

export const Container = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-shrink: 0;
`;

export const SearchBarWrapper = styled.div`
    position: relative;
    width: 300px;

    svg {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--cor-texto-secundario);
    }

    input {
        width: 100%;
        padding: 10px 16px 10px 48px;
        border: 1px solid var(--cor-borda);
        border-radius: 8px;
        font-size: 1rem;
        background-color: var(--cor-principal);

        &::placeholder {
            color: var(--cor-texto-secundario);
        }
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: 16px;

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--cor-texto-secundario);
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            color: var(--cor-texto-principal);
        }
    }
`;

export const FilterButton = styled.button<{ $hasActiveFilters?: boolean }>`
    position: relative;
    background: ${props => props.$hasActiveFilters ? 'var(--cor-verde) !important' : 'none'};
    border: none;
    cursor: pointer;
    color: ${props => props.$hasActiveFilters ? 'white !important' : 'var(--cor-texto-secundario)'};
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
        color: ${props => props.$hasActiveFilters ? 'white !important' : 'var(--cor-texto-principal)'};
        background: ${props => props.$hasActiveFilters ? 'var(--cor-verde) !important' : '#f2f7f9'};
    }

    ${props => props.$hasActiveFilters && `
        &::after {
            content: '';
            position: absolute;
            top: 4px;
            right: 4px;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            border: 2px solid var(--cor-verde);
        }
    `}
`;