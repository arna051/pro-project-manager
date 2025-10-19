import type { FilterQuery, Model, PipelineStage, UpdateQuery, UpdateWithAggregationPipeline, UpdateWriteOpResult } from "mongoose";
import type { GridFSFile } from "mongodb";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import type { ReactNode } from "react";
import type { GitData } from "@electron/terminal/components/git"

export { };

declare global {
  type ModelsNames = "Project" |
    "Category" |
    "Note" |
    "Repo" |
    "Contractor" |
    "Server" |
    "BashScript" |
    "Setting" |
    "Evidence"


  interface Window {
    electron: {
      platform: NodeJS.Platform;
      versions: NodeJS.ProcessVersions;
      browser: {
        min: () => void,
        exit: () => void
      },
      db: {
        find: <T = any>(collection: ModelsNames) => Promise<T[]>
        list: <T = any>(collection: ModelsNames, pipes: PipelineStage[]) => Promise<T[]>
        doc: <T = any>(collection: ModelsNames, pipes: PipelineStage[]) => Promise<T>
        save: (collection: ModelsNames, ...doc: any[]) => Promise<any[]>
        update: (collection: ModelsNames, filter: FilterQuery<any>, update?: UpdateWithAggregationPipeline | UpdateQuery<any>, options?: any) => Promise<UpdateWriteOpResult>,
        remove: (collection: ModelsNames, filter: FilterQuery<any>) => any,
      },
      gridfs: {
        saveBase64: (name: string, contentType: string, base64: string, meta?: Record<string, any>) => Promise<GridFSFile>
        list: (limit?: number, skip?: number) => Promise<GridFSFile[]>
        get: (id: string) => Promise<{ file: GridFSFile; base64: string }>
        remove: (id: string) => Promise<boolean>
        saveFromPath: (filePath: string, meta?: Record<string, any>, file?: File) => Promise<string>
        onFileDrop: (callback: (paths: string[]) => void) => () => void
      }
      dialog: {
        openFile: (options?: OpenDialogOptions) => Promise<OpenDialogReturnValue>
        confirm: (message: string) => Promise<boolean>
      },
      terminal: {
        create: () => Promise<string>
        close: (id: string) => Promise<void>
        write: (id: string, input: string) => void
        onData: (id: string, callback: (data: string) => void) => () => void
        resize: (id: string, cols: number, rows: number) => void,
        createBash: (content: string) => Promise<string>
        execute: (script: string, args?: string[]) => Promise<string>,
        copyFiles: (source: string, dest: string, ignore: string[]) => void
        git: (path: string) => Promise<GitData>
      }
      onMessage: (callback: (d: Record<string, any>) => any) => () => void
      chat: (payload: {
        messages: {
          [k: string]: any;
          role: Role;
          content?: string;
          name?: string;
          tool_call_id?: string;
        }[];
      }) => Promise<any>
    };

  }

  type ChildProp = { children: ReactNode }
  type GSFile = GridFSFile
}
