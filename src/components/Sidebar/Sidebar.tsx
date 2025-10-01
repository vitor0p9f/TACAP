import React from 'react';
import { Users, LayoutGrid } from 'lucide-react';

const CapoeiraIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5,7.5 C14.5,9.43 12.93,11 11,11 C9.07,11 7.5,9.43 7.5,7.5 C7.5,5.57 9.07,4 11,4 C12.93,4 14.5,5.57 14.5,7.5 Z M 9,12 L 13,12 L 13,20 L 16,20 L 16,15 L 18,15 L 18,12 L 6,12 L 6,15 L 8,15 L 8,20 L 11,20 L 11,12 L 9,12 Z" fill="#2D3748" transform="scale(0.8) translate(2, 0)"/>
    </svg>
);

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <CapoeiraIcon />
      </div>
      <nav className="navigation">
        <ul>
          <li className="active">
            <a href="#">
              <Users size={20} />
              <span>Voluntários</span>
            </a>
          </li>
          <li>
            <a href="#">
              <LayoutGrid size={20} />
              <span>Dashboard</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}