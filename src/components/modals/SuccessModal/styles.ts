import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--cor-texto-principal);
  text-align: center;
`;

export const ContinueButton = styled.button`
  background-color: var(--cor-verde);
  color: white;
  border: none;
  padding: 12px 48px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;