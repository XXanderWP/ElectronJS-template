import { StorageController, StorageInitData } from '_/shared/storage';
import _ from 'lodash';
import React from 'react';

export const Storage = new StorageController();

let oldData: StorageDataType = _.cloneDeep(StorageInitData);

window.ipcAPI?.listen('storageData.load', data => {
  oldData = _.cloneDeep(data);
  Storage.Load(data);
  console.log(data);
});

window.ipcAPI?.listen(
  'storageData.set',
  ([key, value]: [
    keyof StorageDataType,
    StorageDataType[keyof StorageDataType],
  ]) => {
    if (_.isEqual(oldData[key], value)) {
      return;
    }

    oldData[key] = value;
    Storage.Set(key, value);
  }
);

window.ipcAPI?.sendData('storageData.request_load');

Storage.OnChangeKey((key, newValue) => {
  console.log(key, newValue);

  if (_.isEqual(oldData[key], newValue)) {
    return;
  }

  window.ipcAPI?.sendData('storageData.send', [key, newValue]);
});

window.storage = Storage;

export const useStorage = () => {
  const [data, setData] = React.useState(() => Storage.data);

  React.useEffect(() => {
    const ev = Storage.OnChange(value => {
      setData({ ...value });
    });

    return () => {
      ev.Remove();
    };
  }, []);

  return data;
};
