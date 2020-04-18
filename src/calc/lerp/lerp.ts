/**
 * Wikipedia precise method for ease.
 * https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
 */
export const lerp = (
  initial: number,
  target: number,
  progress: number
): number => {
  return initial * (1 - progress) + target * progress;
};
