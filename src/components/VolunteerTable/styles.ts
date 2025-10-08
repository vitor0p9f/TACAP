import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

export const TableWrapper = styled.div`
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-borda);
    border-radius: 12px;
    padding: 8px;
    flex-grow: 1;
    overflow-y: auto;

    table {
        border-collapse: collapse;
        margin: 0 auto; 
    }

    th, td {
        padding: 16px;
        text-align: center;
        vertical-align: middle;
        border-bottom: 1px solid var(--cor-borda);
    }

    th:first-child,
    td:first-child {
        text-align: left; 
    }

    th:last-child,
    td:last-child {
        width: 1%; 
        white-space: nowrap;
    }

    thead th {
        font-weight: 600;
        color: var(--cor-texto-secundario);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    .actions-cell {
        display: flex;
        justify-content: center;
        gap: 5px; 

        button {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--cor-texto-secundario);
            
            &:hover {
                color: var(--cor-texto-principal);
            }
        }
    }
`;

export const Footer = styled.footer`
    padding-top: 24px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    
    .add-button {
        background-color: var(--cor-verde);
        color: white;
        border: none;
        padding: 12px 32px;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            opacity: 0.9;
        }
    }
`;