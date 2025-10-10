export interface Avaliacao {
  id?: number;
  voluntario_id: number;
  iacap?: number;
  if_valor?: number;
  potencia?: number;
  rfc?: number;
  pse?: number;
  golpes?: number;
  created_at?: string;
}

const CHANNELS = {
  listByVoluntario: "avaliacao:listByVoluntario",
  create: "avaliacao:create",
  remove: "avaliacao:remove",
} as const;

type UpsertPayload = Omit<Avaliacao, "id" | "created_at">;

function invoke<T>(channel: string, ...args: unknown[]) {
  return window.api.invoke(channel, ...args) as Promise<T>;
}

export const avaliacaoClient = {
  listByVoluntario: (voluntarioId: number) =>
    invoke<Avaliacao[]>(CHANNELS.listByVoluntario, voluntarioId),
  create: (data: UpsertPayload) => invoke<Avaliacao>(CHANNELS.create, data),
  remove: (id: number) => invoke<void>(CHANNELS.remove, id),
};
