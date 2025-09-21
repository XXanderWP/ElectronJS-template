import { app, BrowserWindow } from 'electron';
import path from 'path';
let examplePage: BrowserWindow | undefined;

export const CloseExamplePage = () => {
  if (examplePage && !examplePage.isDestroyed()) {
    examplePage.destroy();
  }

  examplePage = undefined;
};

export const OpenExamplePage = () => {
  CloseExamplePage();

  examplePage = new BrowserWindow({
    height: 880,
    width: 600,
    webPreferences: {
      devTools: !app.isPackaged,
      preload: path.join(__dirname, './preload.bundle.js'),
      webSecurity: true,
    },
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    icon: `${__dirname}/logo.png`,
  });

  examplePage.loadFile(path.join(__dirname, './index.html')).finally(() => {
    examplePage?.show();
    examplePage?.moveTop();
  });

  examplePage.on('closed', () => {
    CloseExamplePage();
  });
};
