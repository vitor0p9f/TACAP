import { ipcMain } from "electron";
import { AvaliacaoService } from "../services/avaliacaoService";

const service = new AvaliacaoService();

export function registerAvaliacaoRoutes() {
    ipcMain.handle("avaliacao:listByVoluntario", async (_e, voluntarioId: number) => await service.listByVoluntario(voluntarioId));
    ipcMain.handle("avaliacao:create", async (_e, data) => await service.create(data));
    ipcMain.handle("avaliacao:remove", async (_e, id: number) => await service.remove(id));
}


