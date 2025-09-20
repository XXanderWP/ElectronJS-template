import React from 'react';

export const Titlebar = React.memo(() => {
  const [title, setTitle] = React.useState(document.title);

  React.useEffect(() => {
    const check = () => {
      if (title !== document.title) {
        setTitle(document.title);
      }
    };

    const int = setInterval(check, 250);

    check();

    return () => {
      clearInterval(int);
    };
  }, [title]);

  const handleMinimize = () => {
    window.ipcAPI?.sendData('window-control', 'minimize');
  };

  const handleMaximize = () => {
    window.ipcAPI?.sendData('window-control', 'maximize');
  };

  const handleClose = () => {
    window.ipcAPI?.sendData('window-control', 'close');
  };

  return (
    <div className="titlebar" data-tauri-drag-region>
      <div className="titlebar-title">{document.title}</div>
      <div className="titlebar-controls">
        <button className="btn minimize" onClick={handleMinimize}>
          ─
        </button>
        <button className="btn maximize" onClick={handleMaximize}>
          ☐
        </button>
        <button className="btn close" onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
});
