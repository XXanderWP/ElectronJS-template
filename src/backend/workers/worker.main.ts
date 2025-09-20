import { fork, ChildProcess } from 'child_process';
import path from 'path';
import { System } from '_shared/system';
import { app, shell } from 'electron';
import '../modules/error.handlers';

export class WorkerMain {
  static OnEvents: {
    id: string;
    name: string;
    cb: (worker: WorkerMain, data: any) => void;
  }[] = [];

  static On(eventName: string, cb: (worker: WorkerMain, data: any) => void) {
    const id = System.randomString(5);

    this.OnEvents.push({ id, name: eventName, cb: cb });

    return {
      Destroy: () => {
        const index = this.OnEvents.findIndex(event => event.id === id);

        if (index >= 0) {
          this.OnEvents.splice(index, 1);
        }
      },
    };
  }

  static workers: WorkerMain[] = [];

  static Send(eventName: string, data: any) {
    this.workers.forEach(worker => {
      worker.Send(eventName, data);
    });
  }

  private child!: ChildProcess;

  readonly workerName: string;
  private initDone = false;
  private OnEvents: { id: string; name: string; cb: (data: any) => void }[] =
    [];

  public Log(...text: any[]) {
    console.log(`[Worker: ${this.workerName}]`, ...text);
  }

  constructor(workerName: string) {
    this.workerName = workerName;
    this.InitCoreEvents();

    this.On('loadComplete', () => {
      this.initDone = true;
    });

    this.InitFork();

    setInterval(async () => {
      if (this.child && (!this.child.connected || this.child.killed)) {
        this.Log(`crash. Restarting...`);
        this.CloseFork();
        await System.sleep(100);
        this.InitFork();
      }
    }, 5000);

    WorkerMain.workers.push(this);
  }

  private CloseFork() {
    if (this.child) {
      try {
        this.child.kill();
      } catch (error) {}
    }
    this.child = undefined as any;
  }

  private InitFork() {
    if (this.child) return;
    this.CloseFork();

    this.child = fork(path.join(__dirname, `workers/${this.workerName}.js`), [
      app.isPackaged ? 'packaged' : 'dev',
    ]);

    this.child.on('exit', (code, signal) => {
      this.Log(`exit. Status code: ${code}, signal: ${signal}. Restarting...`);
      if (!this.child) return;
      this.CloseFork();
      setTimeout(() => {
        this.InitFork();
      }, 100);
    });

    this.child.on('disconnect', () => {
      this.Log(`disconnected. Restarting...`);
      if (!this.child) return;
      this.CloseFork();
      setTimeout(() => {
        this.InitFork();
      }, 100);
    });

    this.child.on('message', (result: any) => {
      const name = result.name;

      const is_global = result.type === 'global';

      const eventsList = is_global ? WorkerMain.OnEvents : this.OnEvents;

      eventsList.forEach(q => {
        if (q.name === name) {
          if (is_global) {
            q.cb(this, result.data);
          } else {
            (q.cb as any)(result.data);
          }
        }
      });
    });
  }

  public Send(eventName: string, data?: any) {
    if (this.initDone && this.child && this.child?.connected) {
      try {
        this.child.send({ name: eventName, data });
      } catch (e) {}
    } else {
      this.Log(
        'Error when sending message (not connected, probably crashed)',
        'Event name:',
        eventName,
        'Data:',
        data
      );
    }
  }

  public OnLoad(cb: (data: any) => void) {
    this.On('loadComplete', cb);
  }

  public On(eventName: string, cb: (data: any) => void) {
    const id = System.randomString(5);

    this.OnEvents.push({ id, name: eventName, cb: cb });

    return {
      Destroy: () => {
        const index = this.OnEvents.findIndex(event => event.id === id);

        if (index >= 0) {
          this.OnEvents.splice(index, 1);
        }
      },
    };
  }

  public Ping() {
    return new Promise<number>(resolve => {
      const start = System.timestampMS;
      const id = System.randomString(5);

      const res = this.On(`_pong_${id}`, () => {
        resolve(System.timestampMS - start);
        res.Destroy();
      });

      this.Send('_ping', id);
    });
  }

  private InitCoreEvents() {
    this.On('_openExternal', ({ url, options }) => {
      shell.openExternal(url, options);
    });

    this.On('_console_log', data => {
      this.Log(...data);
    });
  }
}
