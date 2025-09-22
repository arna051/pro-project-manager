import { contextBridge, ipcRenderer } from 'electron';
import { PipelineStage } from 'mongoose';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
  db: {
    find: (collection: string) => ipcRenderer.invoke("db:find", collection),
    list: (collection: string, pipes: PipelineStage[]) => ipcRenderer.invoke("db:get-list", collection, pipes),
    doc: (collection: string, pipes: PipelineStage[]) => ipcRenderer.invoke("db:get-doc", collection, pipes),
    save: (collection: string, ...doc: any[]) => ipcRenderer.invoke("db:save", collection, ...doc),
    update: (collection: any, filter: any, update: any) => ipcRenderer.invoke("db:update", collection, filter, update),
    remove: (collection: any, filter: any) => ipcRenderer.invoke("db:delete", collection, filter),
  }
});


