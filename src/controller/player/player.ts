import { transform, NORMAL, Range } from 'calc';
import { Normal } from 'normal';

export type Config<T = any> = {
  normal: Normal<T>;
  scale?: number;
};

export const player = <T>(config: Config<T>): any => {
  const scale = config.scale || 1;
  let frame: null | number = null;

  const loop = (from: number, start: number) => {
    const duration = config.normal.duration() * scale;
    const offset = from * duration;
    const range: Range = [0, duration];

    return new Promise((resolve) => {
      const recurse = () => {
        const delta = performance.now() - start;
        const progress = transform(offset + delta, range, NORMAL);

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
    play: (args: { from?: number }) => {
      const from = args.from || 0;
      return loop(from, performance.now());
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
  const progress = value(0)
    .pipe(v => clamp(v, NORMAL))
    .play(p => normal.progress(p));

  const { play, pause } = player({
    scale: 2,
    normal,
    events: {
      onPlay: () => send({type: 'AnimationStart' }),
      onUpdate,
      onComplete: () => send({type: 'AnimationComplete' }),
      onPause
    }
  });

  normal.subscribe(v => {
    console.log(V);
  })

  onClick={() => play({ 
    from: progress.get() 
  })}

  onMouseMove={y => progress.set(normalizedY)}
};

*/
