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

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const BaseButton = styled.button`
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 100px;
`;

export const NoButton = styled(BaseButton)`
  background-color: #EF4444;
  color: white;
`;

export const YesButton = styled(BaseButton)`
  background-color: #E2E8F0;
  color: var(--cor-texto-principal);
`;