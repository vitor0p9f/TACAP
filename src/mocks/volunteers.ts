export interface Volunteer {
    id: number;
    nome: string;
    apelido: string;
    idade: number;
    tempo_pratica: string;
    documento_id?: string;
    peso: number;
    altura: number;
    graduacao: string;
    genero: string;
    endereco: string; // JSON string
    contato: string; // JSON string
    realizouAvaliacao: boolean;
  }
  
  export const mockVolunteers: Volunteer[] = [
    {
      id: 1,
      nome: 'Anderson Silva',
      apelido: 'Anderson',
      idade: 30,
      tempo_pratica: '1 ano',
      peso: 75,
      altura: 1.78,
      graduacao: 'Branca',
      genero: 'masculino',
      endereco: '{"street":"Rua Exemplo, 123","neighborhood":"Bairro Mock","city":"Mockville","uf":"SP","number":"123"}',
      contato: '{"cellphone":"(11) 98765-4321","email":"anderson@example.com"}',
      realizouAvaliacao: true,
    },
    {
      id: 2,
      nome: 'Raquel Souza',
      apelido: 'Raquel',
      idade: 25,
      tempo_pratica: '2 anos',
      peso: 60,
      altura: 1.65,
      graduacao: 'Amarela',
      genero: 'feminino',
      endereco: '{"street":"Avenida Teste, 456","neighborhood":"Centro","city":"Test City","uf":"RJ","number":"456"}',
      contato: '{"cellphone":"(21) 91234-5678","email":"raquel@example.com"}',
      realizouAvaliacao: false,
    },
    {
      id: 3,
      nome: 'Carlos Pereira',
      apelido: 'Formiga',
      idade: 35,
      tempo_pratica: '5 anos',
      peso: 80,
      altura: 1.80,
      graduacao: 'Azul',
      genero: 'masculino',
      endereco: '{"street":"Praça Principal, 789","neighborhood":"Vila Nova","city":"Demo City","uf":"MG","number":"789"}',
      contato: '{"cellphone":"(31) 95555-4444","email":"formiga@example.com"}',
      realizouAvaliacao: true,
    },
    {
      id: 4,
      nome: 'Luana Costa',
      apelido: 'Lua',
      idade: 28,
      tempo_pratica: '3 anos',
      peso: 65,
      altura: 1.70,
      graduacao: 'Verde',
      genero: 'feminino',
      endereco: '{"street":"Rua dos Sonhos, 101","neighborhood":"Jardim das Flores","city":"Springfield","uf":"BA","number":"101"}',
      contato: '{"cellphone":"(71) 93333-2222","email":"lua@example.com"}',
      realizouAvaliacao: false,
    },
  ];