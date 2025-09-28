import { app } from 'electron';
import { createMainWindow } from './windows/app';
import "./model";
import "./handlers";
import "./terminal"

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.whenReady().then(() => {
  createMainWindow()
});


process.on("uncaughtException", console.log)
process.on("uncaughtExceptionMonitor", console.log)
process.on("unhandledRejection", console.log)