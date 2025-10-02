import styled from 'styled-components';

export const Container = styled.aside`
    width: 260px;
    background-color: var(--cor-principal);
    padding: 24px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--cor-borda);
    flex-shrink: 0;
`;

export const LogoWrapper = styled.div`
    margin-bottom: 40px;
    svg {
        width: 32px;
        height: 32px;
    }
`;

export const Navigation = styled.nav`
    list-style: none;

    li a {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        text-decoration: none;
        color: var(--cor-texto-principal);
        font-weight: 500;
        margin-bottom: 8px;
        transition: background-color 0.2s;

        svg {
            margin-right: 12px;
        }
    }

    li.active a,
    li a:hover {
        background-color: var(--cor-fundo-ativo);
    }
`;