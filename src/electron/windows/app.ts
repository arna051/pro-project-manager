import { BrowserWindow } from "electron";
import path from 'node:path';
import isDev from 'electron-is-dev';

export const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 960,
        minHeight: 640,
        show: false,
        transparent: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
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
            const indexHtml = path.join(__dirname, '../out/index.html');
            mainWindow.loadFile(indexHtml);
        }
    })();

    mainWindow.setMenu(null)

    return mainWindow
};
