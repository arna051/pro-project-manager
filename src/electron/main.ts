import { app, BrowserWindow, protocol } from 'electron';
import { createMainWindow } from './windows/app';
import "./model";
import "./handlers";
import "./terminal"
import "./utils/chat"
import { TracyRender } from './utils/tray';
import path, { join } from 'path';
import { existsSync } from 'fs';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);


const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit(); // Quit if another instance is already running
}

const registerAppProtocol = () => {
  const outDir = path.join(__dirname, '../out');
  const resolvedOutDir = path.resolve(outDir);

  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const url = new URL(request.url);
      const decodedPath = decodeURIComponent(url.pathname);
      const normalizedPath = decodedPath.replace(/^\/+/, '');

      const resolveInsideOutDir = (...segments: string[]) =>
        path.resolve(resolvedOutDir, ...segments);

      let targetPath = resolveInsideOutDir(normalizedPath);

      if (decodedPath.endsWith('/')) {
        targetPath = resolveInsideOutDir(normalizedPath, 'index.html');
      } else if (!path.extname(targetPath)) {
        const directoryIndex = resolveInsideOutDir(normalizedPath, 'index.html');
        if (existsSync(directoryIndex)) {
          targetPath = directoryIndex;
        }
      }

      if (!targetPath.startsWith(resolvedOutDir)) {
        callback({ error: -6 });
        return;
      }

      if (!existsSync(targetPath)) {
        callback({ error: -6 }); // net::ERR_FILE_NOT_FOUND
        return;
      }

      callback({ path: targetPath });
    } catch {
      callback({ error: -6 });
    }
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.whenReady().then(() => {
  registerAppProtocol();
  createMainWindow();
  TracyRender()
});


app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Create your own BrowserWindow instead of the default
    const child = new BrowserWindow({
      width: 600,
      height: 600,
      autoHideMenuBar: true, // hides menu bar
      icon: join(__dirname, '../assets/hippogriff.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    child.setMenu(null);
    child.loadURL(url);

    // You control devtools, menus, etc. here
    // e.g., child.removeMenu();

    return { action: "deny" }; // prevents Electron from opening the default window
  });
});



process.on("uncaughtException", console.log)
process.on("uncaughtExceptionMonitor", console.log)
process.on("unhandledRejection", console.log)
