import { app } from 'electron';
import { createMainWindow } from './windows/app';
import "./model";
import "./handlers"

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.whenReady().then(() => {
  createMainWindow()
});
