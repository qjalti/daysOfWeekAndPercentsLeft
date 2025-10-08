const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  playSound: () => ipcRenderer.send("play-sound"),
});
