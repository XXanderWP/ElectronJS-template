type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift';
type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
  TObj,
  Exclude<keyof TObj, ArrayLengthMutationKeys>
> & {
  readonly length: L;
  [I: number]: T;
  [Symbol.iterator]: () => IterableIterator<T>;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(getRandomFloat(min, max));
}

function getRandomFloat(min: number, max: number) {
  if (max < min) {
    [max, min] = [min, max];
  }

  return Math.max(
    min,
    Math.min(min - 0.5 + Math.random() * (max - min + 1), max)
  );
}

function randElIndex<T>(arr: T[]): number;
function randElIndex<T>(arr: T[]): number {
  const newArr = [...arr];

  return getRandomInt(0, newArr.length - 1);
}

function randEl<T>(arr: T[]): T {
  const newArr = [...arr];

  return newArr[getRandomInt(0, newArr.length - 1)];
}

export const System = new (class {
  randomString(
    length: number,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  ) {
    let result = '';
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }

  toBinary(string: string) {
    const codeUnits = new Uint16Array(string.length);

    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }

    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
  }

  fromBinary(encoded: string) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return String.fromCharCode(...new Uint16Array(bytes.buffer));
  }

  sleep(time: number) {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }

  chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  }

  randomElement = randEl;

  randomElementIndex = randElIndex;

  getRandomInt = getRandomInt;

  getRandomFloat = getRandomFloat;

  numberFormat(num: number, replaceIntEnd = true) {
    if (typeof num !== 'number') {
      num = Number(num);
    }

    let n = num.toFixed(2);

    if (replaceIntEnd) {
      n = n.replace('.00', '');
    }

    return n.replace(/.+?(?=\D|$)/, function (f) {
      return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, '$1 ');
    });
  }

  get timestamp() {
    return Math.floor(this.timestampMS / 1000);
  }

  get timestampMS() {
    return Date.now();
  }

  GetFullDateTime(addSeconds = false) {
    const dateTime = new Date();

    return `${this.digitFormat(dateTime.getDate())}.${this.digitFormat(
      dateTime.getMonth() + 1
    )}.${this.digitFormat(dateTime.getFullYear())} ${this.digitFormat(
      dateTime.getHours()
    )}:${this.digitFormat(dateTime.getMinutes())}${addSeconds ? `:${this.digitFormat(dateTime.getSeconds())}` : ``}`;
  }

  get fullDateTime() {
    return this.GetFullDateTime(false);
  }

  get fullDateTimeS() {
    return this.GetFullDateTime(true);
  }

  get dateNotTime() {
    const dateTime = new Date();

    return `${this.digitFormat(dateTime.getDate())}.${this.digitFormat(
      dateTime.getMonth() + 1
    )}.${this.digitFormat(dateTime.getFullYear())}`;
  }

  digitFormat(number: string | number) {
    return `0${number}`.slice(-2);
  }

  lerp2d(
    vector1: { x: number; y: number },
    vector2: { x: number; y: number },
    amount: number
  ) {
    return {
      x: this.lerp(vector1.x, vector2.x, amount),
      y: this.lerp(vector1.y, vector2.y, amount),
    };
  }

  lerp(value1: number, value2: number, amount: number) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;

    return value1 + (value2 - value1) * amount;
  }

  lerpTime(start: number, end: number, current = this.timestampMS) {
    const cnt = current - start;

    return Math.max(0, Math.min(1, cnt / (end - start)));
  }

  lerpVectors(
    vector1: { x: number; y: number; z: number },
    vector2: { x: number; y: number; z: number },
    amount: number
  ) {
    return {
      x: this.lerp(vector1.x, vector2.x, amount),
      y: this.lerp(vector1.y, vector2.y, amount),
      z: this.lerp(vector1.z, vector2.z, amount),
    };
  }

  /** Full date and time string
   * @example 20.01.2020 12:00
   * @example 12:00 (The date is not displayed if it is today's date)
   * @example 20.01.2020 12:00 (The date will always be displayed if the parameter full = true)
   */
  timeStampString(time = this.timestamp, full = false) {
    const dateTimeNow = new Date();
    const dateTime = new Date(time * 1000);

    let res = `${this.digitFormat(dateTime.getHours())}:${this.digitFormat(
      dateTime.getMinutes()
    )}`;

    if (
      full ||
      dateTimeNow.getDate() != dateTime.getDate() ||
      dateTimeNow.getMonth() != dateTime.getMonth() ||
      dateTimeNow.getFullYear() != dateTime.getFullYear()
    ) {
      res = `${this.digitFormat(dateTime.getDate())}.${this.digitFormat(
        dateTime.getMonth() + 1
      )}${
        dateTimeNow.getFullYear() != dateTime.getFullYear() || full
          ? `.${this.digitFormat(dateTime.getFullYear())}`
          : ''
      } ${res}`;
    }

    return res;
  }

  secondsToString(duration: number) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs > 0) {
      ret += `${hrs}:${mins < 10 ? '0' : ''}`;
    }

    ret += `${mins}:${secs < 10 ? '0' : ''}`;
    ret += `${secs}`;

    return ret;
  }

  msToString(duration: number) {
    const seconds = Math.floor(duration / 1000);
    let ret = this.secondsToString(seconds);

    let ms = (duration % 1000).toString();

    while (ms.length < 3) {
      ms = `0${ms}`;
    }

    ret += `.${ms}`;

    return ret;
  }

  sortArray<T>(array: T[], type: 'DESC' | 'ASC' = 'DESC'): Array<T> {
    return array.sort((a, b) => {
      let res = 0;

      if (type !== 'DESC') {
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
      } else {
        if (a < b) {
          res = 1;
        } else if (a > b) {
          res = -1;
        }
      }

      return res;
    });
  }

  sortArrayObjects<T>(
    array: T[],
    param: { id: keyof T; type: 'DESC' | 'ASC' }[]
  ): Array<T> {
    return array.sort((a, b) => {
      let res = 0;

      param.map(q => {
        if (res != 0) {
          return;
        }

        const aval = a[q.id];
        const bval = b[q.id];

        if (q.type !== 'DESC') {
          if (aval < bval) {
            res = -1;
          } else if (aval > bval) {
            res = 1;
          }
        } else {
          if (aval < bval) {
            res = 1;
          } else if (aval > bval) {
            res = -1;
          }
        }
      });

      return res;
    });
  }
})();
