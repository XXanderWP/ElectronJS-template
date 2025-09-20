import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ApplicationEntry } from './App';
import './styles/index.less';

const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);

  root.render(<ApplicationEntry />);
}
