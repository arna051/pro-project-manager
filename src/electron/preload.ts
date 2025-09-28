import { contextBridge, ipcRenderer } from 'electron';
import type { OpenDialogOptions } from 'electron';
import { MongooseUpdateQueryOptions, PipelineStage } from 'mongoose';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
  db: {
    find: (collection: string) => ipcRenderer.invoke("db:find", collection),
    list: (collection: string, pipes: PipelineStage[]) => ipcRenderer.invoke("db:get-list", collection, pipes),
    doc: (collection: string, pipes: PipelineStage[]) => ipcRenderer.invoke("db:get-doc", collection, pipes),
    save: (collection: string, ...doc: any[]) => ipcRenderer.invoke("db:save", collection, ...doc),
    update: (collection: any, filter: any, update: any, options: (MongooseUpdateQueryOptions<any>)) => ipcRenderer.invoke("db:update", collection, filter, update, options),
    remove: (collection: any, filter: any) => ipcRenderer.invoke("db:delete", collection, filter),
  },
  gridfs: {
    saveBase64: (name: string, contentType: string, base64: string, meta: Record<string, any> = {}) =>
      ipcRenderer.invoke("gridfs:save-base64", name, contentType, base64, meta),
    list: (limit?: number, skip?: number) => ipcRenderer.invoke("gridfs:list", limit, skip),
    get: (id: string) => ipcRenderer.invoke("gridfs:get", id),
    remove: (id: string) => ipcRenderer.invoke("gridfs:delete", id),
    saveFromPath: (filePath: string, meta: Record<string, any> = {}) =>
      ipcRenderer.invoke("gridfs:save-path", filePath, meta),
  },
  dialog: {
    openFile: (options?: OpenDialogOptions) => ipcRenderer.invoke("dialog:open-file", options),
  },
  terminal: {
    create: () => ipcRenderer.invoke("create-shell"),
    close: () => ipcRenderer.invoke("remove-shell"),
    write: (id: string, input: string) => ipcRenderer.send("command-input", id, input),
    onData: (id: string, callback: (data: string) => void) => {
      ipcRenderer.on("command-output", (_, incomeId, data) => {
        if (incomeId === id)
          callback(data)
      })
    },
    resize: (id: string, cols: number, rows: number) => ipcRenderer.send("terminal:resize", id, cols, rows),
    createBash: (content: string) => ipcRenderer.invoke("get-bash-file", content),
    execute: (script: string, args: string[]) => ipcRenderer.send("execute", script, args),
    copyFiles: (source: string, dest: string, ignore: string[]) => ipcRenderer.send("copy-files", source, dest, ignore),
    git: (path: string) => ipcRenderer.invoke("git", path),
  }
});
