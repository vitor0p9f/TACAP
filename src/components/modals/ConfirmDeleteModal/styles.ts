import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 16px;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  color: var(--cor-texto-principal);
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const BaseButton = styled.button`
  border: none;
  padding: 10px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

export const NoButton = styled(BaseButton)`
  background-color: #F56565; /* Vermelho */
  color: white;
`;

export const YesButton = styled(BaseButton)`
  background-color: #E2E8F0; /* Cinza claro */
  color: var(--cor-texto-principal);
`;