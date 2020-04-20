import { NORMAL, Range, transform } from 'calc';
import { emitter } from 'emitter';
import { Normal } from '../types';

type Offset = number | ((t: number) => number);
type Entry<T = any> = {
  normal: Normal<T>;
  offset?: Offset;
};
type Config<T extends Entry<number | object>> = {
  [k: string]: T;
};
type Value<T extends Config<Entry<any>>> = {
  [k in keyof T]: ReturnType<T[keyof T]['normal']['progress']>;
};

const current = (t: number, offset?: Offset): number => {
  return !offset ? t : typeof offset === 'number' ? t + offset : offset(t);
};

export const range = (config: Config<Entry<any>>): Range => {
  return Object.values(config).reduce<Range>(
    (r, entry) => {
      const t = current(r[1], entry.offset);
      const start = Math.min(r[0], t);
      const end = Math.max(r[1], t + entry.normal.duration());
      return [start, end];
    },
    [0, 0]
  );
};

type Normalized<T extends Config<Entry>> = {
  [k in keyof T]: Range;
};
const normalize = <T extends Config<Entry>>(config: T): Normalized<T> => {
  const sequenceRange = range(config);
  return Object.entries(config).reduce<[Normalized<T>, number]>(
    ([normalized, t], [key, entry]) => {
      const now = current(t, entry.offset);
      const entryRange: Range = [now, now + entry.normal.duration()];
      normalized[key as keyof T] = [
        entryRange[0] / sequenceRange[0],
        entryRange[1] / sequenceRange[1],
      ];

      return [normalized, Math.max(t, current(t, entry.offset))];
    },
    [{} as Normalized<T>, 0]
  )[0];
};

type Interpolator<T extends Config<Entry>> = (p: number) => Value<T>;
const interpolator = <T extends Config<Entry>>(config: T): Interpolator<T> => {
  const normalized = normalize(config);

  return (p) =>
    Object.entries(config).reduce<Value<T>>((value, [key, entry]) => {
      const entryProgress = transform(p, normalized[key], NORMAL);
      value[key as keyof T] = entry.normal.progress(entryProgress);
      return value;
    }, {} as Value<T>);
};

export const sequence = <T extends Config<Entry<any>>>(
  config: T
): Normal<Value<T>> => {
  const subscription = emitter<Value<T>>();
  const sequenceRange = range(config);
  const sequenceInterpolator = interpolator(config);

  return {
    duration: () => {
      return sequenceRange[1] - sequenceRange[0];
    },
    progress: (p: number) => {
      const interpolated = sequenceInterpolator(p);
      subscription.emit(interpolated);
      return interpolated;
    },
    subscribe: subscription.subscribe,
  };
};
