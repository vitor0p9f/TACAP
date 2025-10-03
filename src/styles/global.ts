import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    /* CSS Reset e Configurações Globais */
    :root {
        --cor-fundo: #F8F8F8;
        --cor-principal: #FFFFFF;
        --cor-verde: #00C853;
        --cor-texto-principal: #2D3748;
        --cor-texto-secundario: #A0AEC0;
        --cor-borda: #E2E8F0;
        --cor-fundo-ativo: #F7FAFC;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

     html, body, #root {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: var(--cor-fundo);
        color: var(--cor-texto-principal);
        -webkit-font-smoothing: antialiased;
    }
`;