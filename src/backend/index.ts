import { app } from 'electron';
import { OpenExamplePage } from './pages/example';
import './modules/window.control';
import './modules/tray';

app.whenReady().then(() => {
  OpenExamplePage();
});
