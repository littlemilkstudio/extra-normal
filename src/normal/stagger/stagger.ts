import { clamp, NORMAL, Range } from 'calc';
import { emitter } from 'emitter';
import { Normal } from '../types';

type Config<T> = {
  length: number;
  stagger: number | ((i: number) => number);
  normal: Normal<T>;
};

const interpolator = <T>(config: Config<T>) => {
  const stagger = Array.from({ length: config.length }, (_, i) =>
    typeof config.stagger === 'number' ? config.stagger : config.stagger(i)
  );

  return (p: number): T[] => {
    const clamped = clamp(p, NORMAL);
    console.log(clamped, stagger);
    return [];
  };
};

export const stagger = <T>(config: Config<T>): Normal<T[]> => {
  const stream = emitter<T[]>();
  const configured = {
    range: [0, 1] as Range,
    interpolator: interpolator(config),
  };

  return {
    duration: () => {
      return 300;
    },
    progress: (p: number) => {
      const interpolated = configured.interpolator(p);
      stream.next(interpolated);
      return interpolated;
    },
    subscribe: stream.subscribe,
  };
};
