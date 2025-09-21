import React from 'react';
import { Titlebar } from './titlebar';
import { useStorage } from './modules/storage';

export const ApplicationEntry = React.memo(() => {
  const storage = useStorage();

  return (
    <>
      <Titlebar />
      <div className="inside">Example React application {storage.firstRun}</div>
    </>
  );
});
