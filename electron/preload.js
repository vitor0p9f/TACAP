const { contextBridge, ipcRenderer } = require("electron");

const api = {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (_, ...args) => func(...args));
    },
};


contextBridge.exposeInMainWorld("api", api);
