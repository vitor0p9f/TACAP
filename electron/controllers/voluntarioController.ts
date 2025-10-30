import { ipcMain } from "electron";
import { VoluntarioService } from "../services/voluntarioService";

const service = new VoluntarioService();

export function registerVoluntarioRoutes() {
    ipcMain.handle("voluntario:list", (_e, search?: string) => service.list(search));
    ipcMain.handle("voluntario:get", (_e, id: number) => service.getById(id));
    ipcMain.handle("voluntario:create", (_e, data) => service.create(data));
    ipcMain.handle("voluntario:update", (_e, id: number, data) => service.update(id, data));
    ipcMain.handle("voluntario:remove", (_e, id: number) => service.remove(id));
}


