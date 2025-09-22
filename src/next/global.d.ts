import { FilterQuery, Model, PipelineStage, UpdateQuery, UpdateWithAggregationPipeline, UpdateWriteOpResult } from "mongoose";
import { ReactNode } from "react";

export { };

declare global {
  type ModelsNames = "Project" | "Category" | "Todo" | "Repo" | ""
  interface Window {
    electron: {
      platform: NodeJS.Platform;
      versions: NodeJS.ProcessVersions;
      db: {
        find: <T = any>(collection: string) => Promise<T[]>
        list: <T = any>(collection: string, pipes: PipelineStage[]) => Promise<T[]>
        doc: <T = any>(collection: string, pipes: PipelineStage[]) => Promise<T>
        save: (collection: string, ...doc: any[]) => Promise<any[]>
        update: (collection: string, filter: FilterQuery<any>, update?: UpdateWithAggregationPipeline | UpdateQuery<any>) => Promise<UpdateWriteOpResult>,
        remove: (collection: string, filter: FilterQuery<any>) => any,
      }
    };
  }

  type ChildProp = { children: ReactNode }
}
