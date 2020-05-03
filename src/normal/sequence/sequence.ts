import { clamp, delta, NORMAL, Range, transform } from 'calc';
import { emit, I, tap } from 'func';
import { Normal } from '../types';

export type Offset = number | ((t: number) => number);
export type Entry<T = any> = {
  normal: Normal<T>;
  offset?: Offset;
};
export type Config<T extends Entry<number | object>> = {
  [k: string]: T;
};
type Value<T extends Config<Entry>> = {
  [k in keyof T]: ReturnType<T[keyof T]['normal']['progress']>;
};

export const current = (t: number, offset?: Offset): number => {
  return !offset ? t : typeof offset === 'number' ? offset : offset(t);
};

export const range = (config: Config<Entry>): Range => {
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
export const normalize = <T extends Config<Entry>>(
  config: T
): Normalized<T> => {
  const configRange = range(config);

  return Object.entries(config).reduce<[Normalized<T>, number]>(
    ([normalized, t], [key, entry]) => {
      const now = current(t, entry.offset);
      const entryRange: Range = [now, now + entry.normal.duration()];
      normalized[key as keyof T] = [
        entryRange[0] / delta(configRange),
        entryRange[1] / delta(configRange),
      ];
      return [normalized, Math.max(t, current(t, entryRange[1]))];
    },
    [{} as Normalized<T>, 0]
  )[0];
};

type Interpolator<T extends Config<Entry>> = (p: number) => Value<T>;
const interpolator = <T extends Config<Entry>>(config: T): Interpolator<T> => {
  const normalized = normalize(config);
  return (p) => {
    return Object.entries(config).reduce<Value<T>>((value, [key, entry]) => {
      const entryProgress = transform(p, normalized[key], NORMAL);
      value[key as keyof T] = entry.normal.progress(entryProgress);
      return value;
    }, {} as Value<T>);
  };
};

export const sequence = <T extends Config<Entry>>(
  config: T
): Normal<Value<T>> => {
  const emitter = emit<Value<T>>();
  const configured = {
    range: range(config),
    interpolator: interpolator(config),
  };

  return {
    duration: () => {
      return delta(configured.range);
    },
    progress: I((p: number) => clamp(p, NORMAL))
      .I(configured.interpolator)
      .I(tap(emitter.emit)),
    subscribe: emitter.subscribe,
  };
};
