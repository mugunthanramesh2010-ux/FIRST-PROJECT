// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  saveVivaRecord: (data) => ipcRenderer.invoke('save-viva-record', data),
  openRecordsFolder: () => ipcRenderer.invoke('open-records-folder'),
  getRecordsSummary: () => ipcRenderer.invoke('get-records-summary'),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen')
});
