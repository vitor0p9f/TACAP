import { ipcMain } from "electron";
import { VoluntarioService } from "../services/voluntarioService";

const service = new VoluntarioService();

export function registerVoluntarioRoutes() {
    ipcMain.handle("voluntario:list", async () => await service.list());
    ipcMain.handle("voluntario:get", async (_e, id: number) => await service.getById(id));
    ipcMain.handle("voluntario:create", async (_e, data) => await service.create(data));
    ipcMain.handle("voluntario:update", async (_e, id: number, data) => await service.update(id, data));
    ipcMain.handle("voluntario:remove", async (_e, id: number) => await service.remove(id));
}


