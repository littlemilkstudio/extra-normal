import { lerp } from '../lerp';

export type Range = [number, number];

export const NORMAL: Range = [0, 1];

export const clamp = (v: number, range: Range): number => {
  const lowerBound = Math.min(range[0], range[1]);
  const upperBound = Math.max(range[0], range[1]);

  return Math.min(Math.max(lowerBound, v), upperBound);
};

export const delta = (range: Range): number => {
  return Math.abs(range[1] - range[0]);
};

export const progress = (v: number, range: Range): number => {
  const clamped = clamp(v, range);
  const delta = clamped - range[0];
  const difference = range[1] - range[0];

  return Math.abs(delta / difference);
};

export const transform = (v: number, initial: Range, target: Range): number => {
  return lerp(target[0], target[1], progress(v, initial));
};
