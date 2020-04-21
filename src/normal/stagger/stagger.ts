import { clamp, delta, NORMAL, Range, transform } from 'calc';
import { emitter } from 'emitter';
import { Normal } from '../types';

type Config<T> = {
  length: number;
  stagger: number | ((i: number) => number);
  normal: Normal<T>;
};

export const range = <T>(config: Config<T>): Range => {
  const duration = config.normal.duration();
  const staggers = Array.from({ length: config.length }, (_, i) =>
    typeof config.stagger === 'number' ? config.stagger : config.stagger(i)
  );

  return staggers.reduce<Range>(
    (r, stagger) => {
      return [Math.min(r[0], stagger), Math.max(r[1], stagger + duration)];
    },
    [staggers[0], staggers[0] + duration]
  );
};

export const interpolator = <T>(config: Config<T>) => {
  const staggers = Array.from({ length: config.length }, (_, i) =>
    typeof config.stagger === 'number' ? config.stagger : config.stagger(i)
  );
  const duration = config.normal.duration();
  const configRange = range(config);
  const normalized = staggers.map<Range>((stagger) => [
    stagger / delta(configRange),
    (stagger + duration) / delta(configRange),
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
