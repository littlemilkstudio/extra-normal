import { lerp } from './lerp';

export type Range = [number, number];

export const clamp = (range: Range) => (v: number) => {
  const lowerBound = Math.min(range[0], range[1]);
  const upperBound = Math.max(range[0], range[1]);

  return Math.min(Math.max(lowerBound, v), upperBound);
};

export const progress = (range: Range) => (v: number) => {
  const clamped = clamp(range)(v);
  const delta = clamped - range[0];
  const difference = range[1] - range[0];

  return Math.abs(delta / difference);
};

export const transform = (v: number, initial: Range, target: Range) => {
  return lerp(target[0], target[1], progress(initial)(v));
};
