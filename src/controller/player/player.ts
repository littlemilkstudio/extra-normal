import { transform, NORMAL, Range } from 'calc';
import { Normal } from 'normal';

/**
 * Scratch pad
 * -----------
 * complete?
 * onNextComplete?
 * - Complete looping anim on next completion
 *
 * have looper() & player() separate?
 */

export type Config<T = any> = {
  normal: Normal<T>;
  timeScale?: number;
};

export const player = <T>(config: Config<T>): any => {
  let frame: null | number = null;

  const loop = (start: number) => {
    const duration = config.normal.duration() * (config.timeScale || 1);
    const range: Range = [0, duration];

    return new Promise((resolve) => {
      const recurse = () => {
        const delta = performance.now() - start;
        const progress = transform(delta, range, NORMAL);

        config.normal.progress(progress);

        if (progress < 1) {
          frame = requestAnimationFrame(recurse);
        } else {
          frame = null;
          resolve();
        }
      };
      recurse();
    });
  };

  return {
    play: () => {
      return loop(performance.now());
    },
    pause: () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    },
  };
};

/**

const normal = tween({
  from: 0,
  to: 1,
});

const Component = () => {
  normal.subscribe((v) => {
    console.log(v);
  });

  const { play, pause } = player({
    normal,
  });

  const { play, pause, complete('nearest' | 'start' | 'end') } = looper({
    yoyo: false,
    normal,
  });

  const css = sampler({
    normal,
  });
};

*/
