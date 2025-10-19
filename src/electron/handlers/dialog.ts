import { BrowserWindow, dialog, ipcMain, OpenDialogOptions } from "electron";

const defaultOptions: OpenDialogOptions = {
    properties: ["openFile"],
};

ipcMain.handle("dialog:open-file", async (_, options: OpenDialogOptions = defaultOptions) => {
    const browserWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined;
    const result = await dialog.showOpenDialog(browserWindow, {
        ...defaultOptions,
        ...options,
    });
    return result;
});

ipcMain.handle("dialog:confirm", async (_, message: string) => {
    const browserWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined;
    const choice = dialog.showMessageBoxSync(browserWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 0,
        cancelId: 1,
        title: 'Confirm',
        message,
    });

    return choice === 0
});
