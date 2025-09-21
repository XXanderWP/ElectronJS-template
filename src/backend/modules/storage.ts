import fs from 'fs';
import { StorageController } from '_/shared/storage';
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';

// Roaming / config path
let basePath: string;

if (process.platform === 'linux') {
  // ~/.config/<AppName>
  basePath = path.join(process.env.HOME as string, '.config', app.getName());
} else {
  // %APPDATA%\<AppName> on Windows
  basePath = path.join(process.env.APPDATA as string, app.getName());
}

const filePath = path.join(basePath, 'storage.json');
function readFileData() {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {}
  return undefined;
}

const data = readFileData();

export const Storage = new StorageController(data);

Storage.OnSave(data => {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
});

Storage.OnLoad(data => {
  BrowserWindow.getAllWindows().forEach(window => {
    if (window.isDestroyed()) return;
    window.webContents.send('storageData.load', data);
  });
});

Storage.OnChangeKey((key, newValue, oldValue) => {
  BrowserWindow.getAllWindows().forEach(window => {
    if (window.isDestroyed()) return;
    window.webContents.send('storageData.set', [key, newValue]);
  });
});

ipcMain.on('storageData.send', (ev, [key, value]) => {
  Storage.Set(key, value);
});
ipcMain.on('storageData.request_load', ev => {
  ev.sender.send('storageData.load', Storage.data);
});

app.on('web-contents-created', (event, contents) => {
  contents.send('storageData.load', Storage.data);
});
