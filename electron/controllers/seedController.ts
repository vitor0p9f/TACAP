import { ipcMain } from 'electron';
import { runSeed } from '../services/seedService';

export function registerSeedRoutes() {
  ipcMain.handle('database:seed', async () => {
    try {
      await runSeed();
      return { success: true, message: 'Banco de dados populado com sucesso!' };
    } catch (error: any) {
      console.error('Erro ao popular o banco de dados:', error);
      return {
        success: false,
        message: `Erro ao popular o banco: ${error.message}`,
      };
    }
  });
}
