import { UsersIcon, AppWindowIcon } from '@phosphor-icons/react';
import * as S from './styles';
import { Pages } from '../../types/pages';

interface SideBarProps {
  currentPage: Pages
  setCurrentPage: (page: Pages) => void
}

export function Sidebar({currentPage, setCurrentPage}:SideBarProps) {
  return (
    <S.Container>
      <S.Navigation>
        <ul>
          <li className={currentPage == "Volunteers" ? "active" : ""}>
            <a href="#" onClick={() => setCurrentPage("Volunteers")}>
              <UsersIcon size={20} />
              <span>Voluntários</span>
            </a>
          </li>
          <li className={currentPage == "Dashboard" ? "active" : ""}>
            <a href="#" onClick={() => setCurrentPage("Dashboard")}>
              <AppWindowIcon size={20} />
              <span>Dashboard</span>
            </a>
          </li>
        </ul>
      </S.Navigation>
    </S.Container>
  );
}