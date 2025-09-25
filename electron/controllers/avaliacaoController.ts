import { ipcMain } from "electron";
import { AvaliacaoService } from "../services/avaliacaoService";

const service = new AvaliacaoService();

export function registerAvaliacaoRoutes() {
    ipcMain.handle("avaliacao:listByVoluntario", (_e, voluntarioId: number) => service.listByVoluntario(voluntarioId));
    ipcMain.handle("avaliacao:create", (_e, data) => service.create(data));
    ipcMain.handle("avaliacao:remove", (_e, id: number) => service.remove(id));
}


