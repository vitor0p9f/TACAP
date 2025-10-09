import styled from 'styled-components';
import styled, { css } from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

interface ModalContainerProps {
  size: 'small' | 'large';
}


export const ModalContainer = styled.div`
  background: var(--cor-principal);
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 90%;

  ${({ size }) => size === 'large' && css`
    max-width: 700px; /* Tamanho para o formulário de avaliação */
  `}

  ${({ size }) => size === 'small' && css`
  max-width: 325px; /* Tamanho para os modais de confirmação/sucesso */
  `}
`;

export const Header = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center;
  margin-bottom: 24px;
  position: relative;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--cor-texto-principal);
  text-align: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cor-texto-secundario);
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
  
  &:hover {
    color: var(--cor-texto-principal);
  }
`;

export const Content = styled.div`
  /* Estilos para o conteúdo do modal */
`;