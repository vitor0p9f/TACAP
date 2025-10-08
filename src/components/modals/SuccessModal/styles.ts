import styled from 'styled-components';

export const Container = styled.div`
  text-align: center;
  padding: 16px;
`;

export const Message = styled.p`
  font-size: 1.25rem;
  color: var(--cor-texto-principal);
  margin-bottom: 24px;
`;

export const ContinueButton = styled.button`
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--cor-verde);
  color: white;
  min-width: 120px;
`;