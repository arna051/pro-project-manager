import Project from "@electron/model/project";
import Category from "@electron/model/category";
import Note from "@electron/model/note";
import Repository from "@electron/model/repo";
import Contractor from "@electron/model/contractor";
import Server from "@electron/model/server";
import BashScript from "@electron/model/bashscript";
import Setting from "@electron/model/settings";
import { ipcMain } from "electron";
import { Document, FilterQuery, Model, MongooseUpdateQueryOptions, PipelineStage, Types, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";
import { deepParseObjectIds } from "@electron/utils/parseIds";

const Models: Record<string, Model<any, {}, {}, {}, {}, Document<Types.ObjectId>>> = {
    Project,
    Category,
    Note,
    Repo: Repository,
    Contractor,
    Server,
    BashScript,
    Setting
}


ipcMain.handle("db:find", async (_, collection: string) => {
    const data = await Models[collection].find().lean();
    return JSON.parse(JSON.stringify(data));
})
ipcMain.handle("db:get-list", async (_, collection: string, pipes: PipelineStage[]) => {
    const data = await Models[collection].aggregate(deepParseObjectIds(pipes));
    return JSON.parse(JSON.stringify(data));
})
ipcMain.handle("db:get-doc", async (_, collection: string, pipes: PipelineStage[]) => {
    const data = await Models[collection].aggregate(deepParseObjectIds(pipes));
    if (!data[0]) return null;
    return JSON.parse(JSON.stringify(data[0]));
})
ipcMain.handle("db:save", async (_, collection: string, ...doc: any[]) => {
    await Models[collection].create(...doc)
})
ipcMain.handle("db:update", async (_, collection: string, filter: FilterQuery<any>, update: UpdateWithAggregationPipeline | UpdateQuery<any>, options: (MongooseUpdateQueryOptions<any>)) => {
    await Models[collection].updateMany(deepParseObjectIds(filter), deepParseObjectIds(update), options);
})
ipcMain.handle("db:delete", async (_, collection: string, filter: FilterQuery<any>) => {
    await Models[collection].deleteMany(deepParseObjectIds(filter))
})
