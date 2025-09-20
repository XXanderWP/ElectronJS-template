import { ipcRenderer } from 'electron';

/** Notify main the renderer is ready. */
function rendererReady() {
  return ipcRenderer.send('renderer-ready');
}

function sendData(event: string, ...args: any[]) {
  return ipcRenderer.send(event, ...args);
}

function getData(event: string, ...args: any[]) {
  return ipcRenderer.invoke(event, ...args);
}

function openURL(url: string) {
  return sendData('openURL', url);
}

function minimize() {
  return sendData('minimizeWindow', true);
}

function close() {
  return sendData('closeWindow', true);
}

function listen(event: string, callback: (...data: any[]) => void) {
  const listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void = (
    event,
    ...args
  ) => {
    callback(...args);
  };

  ipcRenderer.on(event, listener);

  return {
    destroy: () => {
      ipcRenderer.off(event, listener);
    },
  };
}

function listenOnce(event: string, callback: (data: any) => void) {
  return ipcRenderer.once(event, (ev, data) => {
    callback(data);
  });
}

export default {
  rendererReady,
  openURL,
  sendData,
  getData,
  listen,
  listenOnce,
  minimize,
  close,
};
