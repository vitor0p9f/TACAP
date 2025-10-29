import { mockVolunteers } from '../mocks/volunteers';
import type { Volunteer } from '../mocks/volunteers';

// O client original (comunicação com Electron) foi comentado para usar dados mockados no desenvolvimento do filtro.
// Para reativar a comunicação com o banco de dados, basta descomentar o código abaixo e remover a implementação mockada.

/*
export interface Voluntario {
  id?: number;
  nome: string;
  apelido: string;
  idade: number;
  tempo_pratica: string;
  documento_id?: string;
  peso: number;
  altura: number;
  graduacao: string;
  genero: string;
  endereco: string;
  contato: string;
  created_at?: string;
}

const CHANNELS = {
  list: "voluntario:list",
  get: "voluntario:get",
  create: "voluntario:create",
  update: "voluntario:update",
  remove: "voluntario:remove",
} as const;

type UpsertPayload = Omit<Voluntario, "id" | "created_at">;

function invoke<T>(channel: string, ...args: unknown[]) {
  return window.api.invoke(channel, ...args) as Promise<T>;
}

export const voluntarioClient = {
  list: () => invoke<Voluntario[]>(CHANNELS.list),
  get: (id: number) => invoke<Voluntario | null>(CHANNELS.get, id),
  create: (data: UpsertPayload) => invoke<Voluntario>(CHANNELS.create, data),
  update: (id: number, data: UpsertPayload) => invoke<Voluntario>(CHANNELS.update, id, data),
  remove: (id: number) => invoke<void>(CHANNELS.remove, id),
};
*/

// --- Implementação Mockada ---

export type { Volunteer };

export const voluntarioClient = {
  list: (): Promise<Volunteer[]> => {
    // Simula uma pequena demora de rede para uma experiência mais realista.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockVolunteers);
      }, 500);
    });
  },
};