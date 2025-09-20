import { System } from '_/shared/system';
import '../modules/error.handlers';
if (typeof process.send === 'function') {
  global.isPackaged = process.argv[2] === 'packaged';
}

export const WorkerInside = new (class {
  get isWorker() {
    return typeof process.send === 'function';
  }

  get isPackaged(): boolean {
    return process.argv[2] === 'packaged';
  }

  constructor() {
    if (typeof process.send !== 'function') {
      return;
    }

    global.isPackaged = this.isPackaged;

    process.on('message', (msg: any) => {
      this.OnEvents.forEach(q => {
        if (q.name === msg.name) {
          q.cb(msg.data);
        }
      });
    });

    this.On('_ping', id => {
      this.Send(`_pong_${id}`);
    });

    this.Send('loadComplete');
  }

  Send(name: string, data?: any) {
    process.send?.({ name, data });
  }

  SendGlobal(name: string, data?: any) {
    process.send?.({ name, data, type: 'global' });
  }

  private OnEvents: { id: string; name: string; cb: (data: any) => void }[] =
    [];

  On(eventName: string, callback: (result?: any) => void) {
    const id = System.randomString(5);

    this.OnEvents.push({ id, name: eventName, cb: callback });

    return {
      Destroy: () => {
        const index = this.OnEvents.findIndex(event => event.id === id);

        if (index >= 0) {
          this.OnEvents.splice(index, 1);
        }
      },
    };
  }
})();

if (typeof process.send === 'function') {
  global.openExternal = (
    url: string,
    options?: Electron.OpenExternalOptions | undefined
  ) => {
    WorkerInside.Send('_openExternal', { url, options });
  };

  console.log = (...texts: any[]) => {
    WorkerInside.Send('_console_log', texts);
  };
}
