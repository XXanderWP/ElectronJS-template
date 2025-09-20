import React from 'react';
import { Titlebar } from './titlebar';

export const ApplicationEntry = React.memo(() => {
  return (
    <>
      <Titlebar />
      <div className="inside">Example React application</div>
    </>
  );
});
