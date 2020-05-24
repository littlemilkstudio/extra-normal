export type Signal<T = any> =
  | {
      talkback: (signal: Signal<T>) => void;
      isStart: true;
      isPush: false;
      isPull: false;
      isStop: false;
    }
  | {
      value: T;
      isStart: false;
      isPush: true;
      isPull: false;
      isStop: false;
    }
  | {
      isStart: false;
      isPush: false;
      isPull: true;
      isStop: false;
    }
  | {
      error?: Error;
      isStart: false;
      isPush: false;
      isPull: false;
      isStop: true;
    };

export type Callbag<T = any> = (signal: Signal<T>) => void;

export const start = <T>(talkback: Callbag<T>): Signal<T> => ({
  talkback,
  isStart: true,
  isPush: false,
  isPull: false,
  isStop: false,
});

export const push = <T>(value: T): Signal<T> => ({
  value,
  isStart: false,
  isPush: true,
  isPull: false,
  isStop: false,
});

export const pull = (): Signal => ({
  isStart: false,
  isPush: false,
  isPull: true,
  isStop: false,
});

export const stop = (error?: Error): Signal => ({
  error,
  isStart: false,
  isPush: false,
  isPull: false,
  isStop: true,
});
