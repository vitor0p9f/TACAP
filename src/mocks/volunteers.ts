export interface Volunteer {
  id: number;
  apelido: string;
  graduacao: 'Crua' | 'Ponta Crua Amarela' | 'Ponta Amarela' | 'Ponta Amarela Laranja' | 'Ponta Laranja' | 'Ponta Laranja Azul' | 'Ponta Azul' | 'Crua Amarela' | 'Amarela' | 'Crua Laranja' | 'Amarela Laranja' | 'Laranja' | 'Crua Azul' | 'Amarela Azul' | 'Laranja Azul' | 'Azul' | 'Azul Verde' | 'Verde' | 'Verde Roxa' | 'Roxa' | 'Roxa Marrom' | 'Marrom' | 'Marrom Vermelha' | 'Roxa Amarela' | 'Roxa Laranja' | 'Roxa Azul' | 'Marrom Amarela' | 'Marrom Laranja' | 'Marrom Azul' | 'Marrom Verde' | 'Marrom Branca' | 'Vermelha' | 'Vermelha Branca' | 'Branca';
  tempoDePratica: string;
  realizouAvaliacao: boolean;
}

export const mockVolunteers: Volunteer[] = [
  {
    id: 1,
    apelido: 'Anderson',
    graduacao: 'Branca',
    tempoDePratica: '1 ano',
    realizouAvaliacao: true,
  },
  {
    id: 2,
    apelido: 'Raquel',
    graduacao: 'Amarela',
    tempoDePratica: '2 anos',
    realizouAvaliacao: false,
  },
  {
    id: 3,
    apelido: 'Formiga',
    graduacao: 'Azul',
    tempoDePratica: '5 anos',
    realizouAvaliacao: true,
  },
  {
    id: 4,
    apelido: 'Lua',
    graduacao: 'Verde',
    tempoDePratica: '3 anos',
    realizouAvaliacao: false,
  },
];