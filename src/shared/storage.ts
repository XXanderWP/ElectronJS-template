import _ from 'lodash';
import { System } from './system';

export const StorageInitData = {
  firstRun: 0,
};

/** Main storage controller */
export class StorageController {
  private _data: StorageDataType = StorageInitData;

  private saveDelay = false;

  private _onLoad: { id: string; handle: (data: StorageDataType) => void }[] =
    [];
  private _onChange: {
    id: string;
    handle: (newData: StorageDataType, oldData: StorageDataType) => void;
  }[] = [];
  private _onChangeKey: {
    id: string;
    handle: (
      key: keyof StorageDataType,
      newValue: StorageDataType[keyof StorageDataType],
      oldValue: StorageDataType[keyof StorageDataType]
    ) => void;
  }[] = [];
  private _onSave: { id: string; handle: (data: StorageDataType) => void }[] =
    [];

  get data() {
    return this._data;
  }

  OnLoad(handle: (data: StorageDataType) => void) {
    const id = System.randomString(5);
    this._onLoad.push({ id, handle });
    return {
      Remove: () => {
        this._onLoad = this._onLoad.filter(q => q.id !== id);
      },
    };
  }

  OnChange(
    handle: (newData: StorageDataType, oldData: StorageDataType) => void
  ) {
    const id = System.randomString(5);
    this._onChange.push({ id, handle });
    return {
      Remove: () => {
        this._onChange = this._onChange.filter(q => q.id !== id);
      },
    };
  }
  OnChangeKey(
    handle: (
      key: keyof StorageDataType,
      newValue: StorageDataType[keyof StorageDataType],
      oldValue: StorageDataType[keyof StorageDataType]
    ) => void
  ) {
    const id = System.randomString(5);
    this._onChangeKey.push({ id, handle });
    return {
      Remove: () => {
        this._onChangeKey = this._onChangeKey.filter(q => q.id !== id);
      },
    };
  }

  OnSave(handle: (data: StorageDataType) => void) {
    const id = System.randomString(5);
    this._onSave.push({ id, handle });
    return {
      Remove: () => {
        this._onSave = this._onSave.filter(q => q.id !== id);
      },
    };
  }

  Load(data: StorageDataType) {
    this._data = _.cloneDeep(data);

    this._onLoad.forEach(q => q.handle(this._data));
  }

  Set<K extends keyof StorageDataType>(
    key: K,
    value: StorageDataType[K],
    save = false
  ) {
    const oldData = _.cloneDeep(this._data);
    this._data[key] = value;
    this._onChange.forEach(q => q.handle(this._data, oldData));
    this._onChangeKey.forEach(q =>
      q.handle(key, this._data[key], oldData[key])
    );
    if (save) {
      this.Save();
    } else {
      this.saveDelay = true;
    }
  }

  Get<K extends keyof StorageDataType>(key: K): StorageDataType[K] {
    return this._data[key];
  }

  Clear() {
    this.Load(StorageInitData);
  }

  Save() {
    this.saveDelay = false;
    this._onSave.forEach(q => q.handle(this._data));
  }

  constructor(initData?: StorageDataType) {
    // Init default storage
    this.Load(initData || StorageInitData);

    setInterval(() => {
      if (!this.saveDelay) return;
      this.Save();
    }, 1000);
  }
}
