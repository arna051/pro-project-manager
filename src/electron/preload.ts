import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { OpenDialogOptions } from 'electron';
import { MongooseUpdateQueryOptions, PipelineStage } from 'mongoose';
import { SSHConfig } from './ssh/components/execute';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
  browser: {
    min: () => ipcRenderer.send("minimize"),
    exit: () => ipcRenderer.send("exit")
  },
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
    saveFromPath: (filePath: string, meta: Record<string, any> = {}, file?: File) =>
      ipcRenderer.invoke("gridfs:save-path", filePath, meta, file),
    onFileDrop: (callback: (paths: string[]) => void) => {

      const drop = async (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        callback((await fileGetter(e)).map((X: any) => X.path))
      }
      const dragover = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }
      window.addEventListener("drop", drop);

      window.addEventListener("dragover", dragover);

      return () => {
        window.removeEventListener("drop", drop)
        window.removeEventListener("dragover", dragover)
      }
    }
  },
  dialog: {
    openFile: (options?: OpenDialogOptions) => ipcRenderer.invoke("dialog:open-file", options),
    confirm: (message: string) => ipcRenderer.invoke("dialog:confirm", message)
  },
  terminal: {
    create: () => ipcRenderer.invoke("create-shell"),
    close: (id: string) => ipcRenderer.invoke("remove-shell", id),
    write: (id: string, input: string) => ipcRenderer.send("command-input", id, input),
    onData: (id: string, callback: (data: string) => void) => {
      const handler = (_: any, incomeId: any, data: any) => {
        if (incomeId === id)
          callback(data)
      }
      ipcRenderer.on("command-output", handler)
      return () => ipcRenderer.removeListener("command-output", handler)
    },
    resize: (id: string, cols: number, rows: number) => ipcRenderer.send("terminal:resize", id, cols, rows),
    createBash: (content: string) => ipcRenderer.invoke("get-bash-file", content),
    execute: (script: string, args: string[]) => ipcRenderer.invoke("execute", script, args),
    copyFiles: (source: string, dest: string, ignore: string[]) => ipcRenderer.send("copy-files", source, dest, ignore),
    git: (path: string) => ipcRenderer.invoke("git", path),
  },
  onMessage: (callback: (d: Record<string, any>) => any) => {
    const eventHandler = (event: any, data: any) => {
      callback(data)
    }
    ipcRenderer.on("message-from-main", eventHandler);
    return () => {
      ipcRenderer.removeListener("message-from-main", eventHandler)
    }
  },

  chat: (payload: {
    messages: Array<{
      role: "system" | "user" | "assistant" | "tool";
      content?: string;
      name?: string;
      tool_call_id?: string; // keep any extra fields the renderer may send
      [k: string]: any;
    }>;
  }
  ) => ipcRenderer.invoke("llm:chat", payload),

  ssh: {
    run: (cfg: SSHConfig,
      command: string,) => ipcRenderer.invoke('ssh:execute', cfg, command)
  }
});


const fileGetter = async (event: DragEvent) => {
  const files = [];
  const fileList = event.dataTransfer?.files;

  if (!fileList) return []

  for (var i = 0; i < fileList.length; i++) {
    const file = fileList.item(i);

    if (!file) continue;
    Object.defineProperty(file, 'path', {
      value: webUtils.getPathForFile(file), // resolve the full path
    });

    files.push(file);
  }

  return files;
};