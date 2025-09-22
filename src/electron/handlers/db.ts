import Project from "@electron/model/project";
import { ipcMain } from "electron";
import { FilterQuery, Model, PipelineStage, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";


const Models: Record<string, Model<any>> = {
    Project
}


ipcMain.handle("db:find", async (_, collection: string) => {
    const data = await Models[collection].find().lean();
    return data;
})
ipcMain.handle("db:get-list", async (_, collection: string, pipes: PipelineStage[]) => {
    const data = await Models[collection].aggregate(pipes);
    return data;
})
ipcMain.handle("db:get-doc", async (_, collection: string, pipes: PipelineStage[]) => {
    const data = await Models[collection].aggregate(pipes);
    return data[0];
})
ipcMain.handle("db:save", async (_, collection: string, ...doc: any[]) => {
    const data = await Models[collection].create(...doc)
    return data;
})
ipcMain.handle("db:update", async (_, collection: string, filter: FilterQuery<any>, update?: UpdateWithAggregationPipeline | UpdateQuery<any>) => {
    const data = await Models[collection].updateMany(filter, update);
    return data;
})
ipcMain.handle("db:delete", async (_, collection: string, filter: FilterQuery<any>) => {
    const data = await Models[collection].deleteMany(filter)
    return data;
})