declare global {
  interface Window {
    /** APIs for Electron IPC */
    ipcAPI?: typeof import('_preload/ipc-api').default;
  }
  function openExternal(
    url: string,
    options?: Electron.OpenExternalOptions | undefined
  ): void;
  var isPackaged: boolean;
}

declare module '*.node' {
  const content: any;
  export default content;
}

// Makes TS sees this as an external modules so we can extend the global scope.
export {};
