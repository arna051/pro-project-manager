import { ipcMain } from "electron";
import { deleteFile, getFile, listFiles, saveBase64File, saveFileFromPath } from "@electron/model/gridfs";

ipcMain.handle("gridfs:save-base64", async (_, name: string, contentType: string, base64: string, meta: Record<string, any> = {}) => {
    const file = await saveBase64File(name, contentType, base64, meta);
    return file;
});

ipcMain.handle("gridfs:list", async (_, limit?: number, skip?: number) => {
    const files = await listFiles(limit, skip);
    return files;
});

ipcMain.handle("gridfs:delete", async (_, id: string) => {
    await deleteFile(id);
    return true;
});

ipcMain.handle("gridfs:get", async (_, id: string) => {
    const result = await getFile(id);
    return result;
});

ipcMain.handle("gridfs:save-path", async (_, filePath: string, meta: Record<string, any> = {}, f?: File) => {

    const file = await saveFileFromPath(filePath, meta);

    return file._id.toHexString();
});
