import { app, Menu, Rectangle, Tray } from 'electron';
import path from 'path';
import { System } from '../../shared/system';

export const TrayController = new (class {
  private _contextMenu!: (
    | Electron.MenuItemConstructorOptions
    | Electron.MenuItem
  )[];

  private _show = false;

  private tray!: Tray;

  private OnEvents: {
    id: string;
    name: 'double-click' | 'click' | 'right-click';
    cb: (event: Electron.KeyboardEvent, bounds: Rectangle) => void;
  }[] = [];

  On(
    name: 'double-click' | 'click' | 'right-click',
    cb: (event: Electron.KeyboardEvent, bounds: Rectangle) => void
  ) {
    const id = System.randomString(5);

    this.OnEvents.push({ id, name, cb: cb });

    return {
      Destroy: () => {
        const index = this.OnEvents.findIndex(event => event.id === id);

        if (index >= 0) {
          this.OnEvents.splice(index, 1);
        }
      },
    };
  }

  private _handleAction(
    name: 'double-click' | 'click' | 'right-click',
    event: Electron.KeyboardEvent,
    bounds: Rectangle
  ) {
    this.OnEvents.filter(q => q.name === name).forEach(q =>
      q.cb(event, bounds)
    );
  }

  private _RebuildContextMenu() {
    if (this.tray) {
      this.tray.destroy();
    }
    if (!this.show) return;
    this.tray = new Tray(path.join(__dirname, 'icon.png'));

    this.tray.on('double-click', (event, bound) => {
      this._handleAction('double-click', event, bound);
    });
    this.tray.on('click', (event, bound) => {
      this._handleAction('click', event, bound);
    });
    this.tray.on('right-click', (event, bound) => {
      this._handleAction('right-click', event, bound);
    });
    if (this._contextMenu)
      this.tray.setContextMenu(Menu.buildFromTemplate(this._contextMenu));
    else {
      this.tray.setContextMenu(null);
    }
  }

  get contextMenu() {
    return this._contextMenu;
  }
  set contextMenu(val) {
    this._contextMenu = val;
    this._RebuildContextMenu();
  }

  get show() {
    return this._show;
  }
  set show(val) {
    if (!!val === !!this._show) return;
    this.show = !!val;
    this._RebuildContextMenu();
  }

  constructor() {
    app.whenReady().then(() => {
      this._RebuildContextMenu();
    });
  }
})();
