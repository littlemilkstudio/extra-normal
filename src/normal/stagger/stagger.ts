import { clamp, delta, NORMAL, Range, transform } from 'calc';
import { emitter } from 'emitter';
import { Normal } from '../types';

type Stagger = number | ((i: number) => number);

type Config<T> = {
  length: number;
  stagger: Stagger;
  normal: Normal<T>;
};

const current = (stagger: Stagger, i: number) => {
  return typeof stagger === 'number' ? stagger * i : stagger(i);
};

export const range = <T>(config: Config<T>): Range => {
  const duration = config.normal.duration();
  const starts = Array.from({ length: config.length }, (_, i) =>
    current(config.stagger, i)
  );

  return starts.reduce<Range>(
    (r, entry) => {
      return [Math.min(r[0], entry), Math.max(r[1], entry + duration)];
    },
    [starts[0], starts[0] + duration]
  );
};

export const interpolator = <T>(config: Config<T>) => {
  const starts = Array.from({ length: config.length }, (_, i) =>
    current(config.stagger, i)
  );
  const duration = config.normal.duration();
  const configRange = range(config);
  const normalized = starts.map<Range>((entry) => [
    entry / delta(configRange),
    (entry + duration) / delta(configRange),
  ]);

  return (p: number): T[] => {
    const clamped = clamp(p, NORMAL);
    return normalized.map<T>((stagger) => {
      return config.normal.progress(transform(clamped, stagger, NORMAL));
    });
  };
};

export const stagger = <T>(config: Config<T>): Normal<T[]> => {
  const stream = emitter<T[]>();
  const configured = {
    range: range(config),
    interpolator: interpolator(config),
  };

  return {
    duration: () => {
      return delta(configured.range);
    },
    progress: (p: number) => {
      const interpolated = configured.interpolator(p);
      stream.next(interpolated);
      return interpolated;
    },
    subscribe: stream.subscribe,
  };
};
