import { BrowserWindow, ipcMain, app } from "electron";
import path from 'node:path';

export const isDev = !app.isPackaged;
export let main: null | BrowserWindow = null;
export const createMainWindow = () => {
    if (main) return main.show()
    const mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        show: false,
        transparent: true,
        frame: false,
        icon: path.join(__dirname, '../assets/hippogriff.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,          // 👈 important
            webSecurity: false,      // 👈 allows access to .path

        },
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    (async () => {
        if (isDev) {
            const devServerURL = 'http://localhost:4152';
            mainWindow.loadURL(devServerURL);
            mainWindow.webContents.openDevTools({ mode: 'detach' });
        } else {
            const indexUrl = 'app://-/index.html';
            mainWindow.loadURL(indexUrl);
        }
    })();

    mainWindow.setMenu(null)

    main = mainWindow

    return mainWindow
};


ipcMain.on("exit", () => {
    main?.hide();
})

ipcMain.on("minimize", () => {
    main?.minimize()
})
