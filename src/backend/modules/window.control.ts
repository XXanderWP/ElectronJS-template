import { app, BrowserWindow, ipcMain, Menu } from 'electron';

ipcMain.on(
  'window-control',
  (ev, action: 'minimize' | 'maximize' | 'close') => {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      return;
    }

    switch (action) {
      case 'minimize':
        win.minimize();
        break;

      case 'maximize':
        win.isMaximized() ? win.unmaximize() : win.maximize();
        break;

      case 'close':
        win.close();
        break;
    }
  }
);

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
});

if (process.env.KEEP_APP_AFTER_LAST_WINDOW) {
  app.on('window-all-closed', () => {
    // Keep application running after close all windows
  });
}
