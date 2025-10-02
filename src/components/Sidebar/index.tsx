import React from "react";
import { UsersIcon, AppWindowIcon } from "@phosphor-icons/react";
import CapoeiraIcon from "../../assets/capoeirista.svg?react";
import * as S from "./styles";

export function Sidebar() {
  return (
    <S.Container>
      <S.LogoWrapper>
        <CapoeiraIcon />
      </S.LogoWrapper>
      <S.Navigation>
        <ul>
          <li className="active">
            <a href="#">
              <UsersIcon size={20} />
              <span>Voluntários</span>
            </a>
          </li>
          <li>
            <a href="#">
              <AppWindowIcon size={20} />
              <span>Dashboard</span>
            </a>
          </li>
        </ul>
      </S.Navigation>
    </S.Container>
  );
}
