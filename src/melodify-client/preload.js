const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  writeFile: async (filePath, data) => {
    await fs.writeFile(filePath, data);
  },
  ensureDir: async (dirPath) => {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
});