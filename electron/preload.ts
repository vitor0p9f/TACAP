import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

type IpcListener = (event: IpcRendererEvent, ...args: any[]) => void;

const api = {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: IpcListener) => ipcRenderer.on(channel, listener),
    removeListener: (channel: string, listener: IpcListener) => ipcRenderer.removeListener(channel, listener),
};

contextBridge.exposeInMainWorld("api", api as any);



