import styled from 'styled-components';

const tableMinWidth = '900px';

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  font-family: Inter, 'Helvetica Neue', Arial, sans-serif;
`;

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.03);
  border: 1px solid #e6eef2;
  overflow: auto;
  max-height: calc(100vh - 200px);

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: ${tableMinWidth};
    table-layout: fixed;
  }

  thead {
    background: transparent;
    tr {
      th {
        font-size: 13px;
        font-weight: 600;
        color: #9aa9b3;
        text-transform: uppercase;
        padding: 20px 24px;
        border-bottom: 1px solid #eef4f6;
        text-align: left;
        vertical-align: middle;
        white-space: nowrap;
      }

      th.actions-header {
        text-align: center;
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f6f8;
      td {
        font-size: 16px;
        color: #3b4b52;
        padding: 24px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
      }

      td.actions-cell {
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
        padding: 12px 16px;
        width: 140px;
      }

      td:not(.actions-cell) {
        padding-right: 12px;
      }

      button {
        background: transparent;
        border: none;
        padding: 6px;
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 6px;
        width: 36px;
        height: 36px;
      }

      button:hover {
        background: #f2f7f9;
      }

      button[title="Excluir"]:hover {
        background: rgba(255, 60, 60, 0.06);
      }
    }
  }

  tr > :last-child {
    width: 140px;
  }

  @media (max-width: 640px) {
    td.actions-cell {
      gap: 6px;
      width: 120px;
    }
    tr > :last-child {
      width: 120px;
    }
    thead tr th {
      padding: 12px 10px;
    }
    tbody tr td {
      padding: 12px 10px;
      font-size: 14px;
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
