"use strict";
const electron = require("electron");
const { ipcRenderer, contextBridge } = electron;
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
contextBridge.exposeInMainWorld("electronAPI", {
  screenshots: {
    captureFullScreen: () => ipcRenderer.invoke("screenshot:capture-full"),
    copyToClipboard: (imageDataUrl) => ipcRenderer.invoke("screenshot:copy", imageDataUrl),
    deleteScreenshot: (imagePath) => ipcRenderer.invoke("screenshot:delete", imagePath),
    saveScreenshot: (imageDataUrl) => ipcRenderer.invoke("screenshot:save", imageDataUrl)
  },
  regionCapture: {
    start: () => ipcRenderer.invoke("region-capture:start"),
    capture: (x, y, width, height) => ipcRenderer.invoke("region-capture:capture", x, y, width, height),
    cancel: () => ipcRenderer.invoke("region-capture:cancel")
  }
});
