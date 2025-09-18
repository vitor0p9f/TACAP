import { contextBridge, ipcRenderer } from "electron";

// Define a interface das funções que estarão disponíveis no renderer
export interface ElectronAPI {
    send: (channel: string, data: unknown) => void;
    receive: (channel: string, func: (...args: unknown[]) => void) => void;
}

const api: ElectronAPI = {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (_, ...args) => func(...args));
    },
};

// Expõe no escopo global do renderer
contextBridge.exposeInMainWorld("api", api);

declare global {
    interface Window {
        api: ElectronAPI;
    }
}
