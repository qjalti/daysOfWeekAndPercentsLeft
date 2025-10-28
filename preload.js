const { contextBridge, ipcRenderer } = require("electron");
const lottie = require("lottie-web");

contextBridge.exposeInMainWorld("electronAPI", {
  playSound: () => ipcRenderer.send("play-sound"),
  closeWindow: () => ipcRenderer.send("close-window"),
  loadLottieAnimation: (options) => {
    return lottie.loadAnimation({
      ...options,
    });
  },
});
