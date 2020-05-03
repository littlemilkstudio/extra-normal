import { emit, I, tap } from 'func';
import { delta, clamp, transform, NORMAL, Range } from 'calc';
import { Normal } from '../types';

type Entry<T = any> = Normal<T>;
export type Config<T extends Entry<number | object>> = {
  [k: string]: T;
};
type Value<T extends Config<Entry>> = {
  [k in keyof T]: ReturnType<T[keyof T]['progress']>;
};

const range = <T extends Config<Entry>>(config: T): Range => {
  return Object.values(config).reduce<Range>(
    (r, entry) => [r[0], Math.max(r[1], entry.duration())],
    [0, 0]
  );
};

type Normalized<T extends Config<Entry>> = {
  [k in keyof T]: Range;
};
const normalize = <T extends Config<Entry>>(config: T): Normalized<T> => {
  const duration = delta(range(config));
  return Object.entries(config).reduce<Normalized<T>>(
    (normalized, [key, entry]) => {
      normalized[key as keyof T] = [0, entry.duration() / duration];
      return normalized;
    },
    {} as Normalized<T>
  );
};

type Interpolator<T extends Config<Entry>> = (p: number) => Value<T>;
const interpolator = <T extends Config<Entry>>(config: T): Interpolator<T> => {
  const normalized = normalize(config);
  return (p) => {
    return Object.entries(config).reduce<Value<T>>((value, [key, entry]) => {
      value[key as keyof T] = entry.progress(
        transform(p, normalized[key], NORMAL)
      );
      return value;
    }, {} as Value<T>);
  };
};

export const group = <T extends Config<Entry>>(config: T): Normal<Value<T>> => {
  const emitter = emit<Value<T>>();
  const configured = {
    range: Object.values(config).reduce<Range>(
      (r, entry) => {
        return [0, Math.max(r[1], entry.duration())];
      },
      [0, 0]
    ),
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
