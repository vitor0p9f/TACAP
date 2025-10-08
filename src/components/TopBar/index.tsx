import React from 'react';
import CapoeiraIcon from "../../assets/capoeirista.svg?react";
import * as S from './styles';

export function TopBar() {
  return (
    <S.Container>
      <CapoeiraIcon />
    </S.Container>
  );
}