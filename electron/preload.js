const { contextBridge, ipcRenderer } = require("electron");

const api = {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
};

contextBridge.exposeInMainWorld("api", api);
