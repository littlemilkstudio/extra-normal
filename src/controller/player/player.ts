import { transform, NORMAL, Range } from 'calc';
import { Normal } from 'normal';

export type Config<T = any> = {
  normal: Normal<T>;
  scale?: number;
  events?: {
    onPlay?: VoidFunction;
    onUpdate?: (p: number) => void;
    onComplete?: VoidFunction;
    onPause?: VoidFunction;
  };
};

export const player = <T>(config: Config<T>): any => {
  const scale = config.scale || 1;
  let frame: null | number = null;

  const loop = (from: number, start: number) => {
    const duration = config.normal.duration() * scale;
    const offset = from * duration;
    const range: Range = [0, duration];
    config.events?.onPlay?.();

    return new Promise((resolve) => {
      const recurse = () => {
        const delta = performance.now() - start;
        const progress = transform(offset + delta, range, NORMAL);

        config.normal.progress(progress);
        config.events?.onUpdate?.(progress);

        if (progress < 1) {
          frame = requestAnimationFrame(recurse);
        } else {
          frame = null;
          config.events?.onComplete?.();
          resolve();
        }
      };
      recurse();
    });
  };

  return {
    play: (args: { from?: number }) => {
      const from = args.from || 0;
      return loop(from, performance.now());
    },
    pause: () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
        config.events?.onPause?.();
      }
    },
  };
};

/**

const normal = sequence({
  anim1: {},
  anim2: {},
  anim3: {}
})

const Component = (controller) => {
  normal.subscribe(v => {
    // DOM manipulations
  })

  constroller.subscribe(normal.progress);

  const { subscibe, play, pause } = player({
    scale: 2,
    normal,
    events: {
      onPlay: () => send({type: 'AnimationStart' }),
      onUpdate,
      onComplete: () => send({type: 'AnimationComplete' }),
      onPause
    }
  });
};

*/
