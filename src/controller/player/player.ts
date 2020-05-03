import { Range, progress } from 'calc';
import { emit, I, tap } from 'func';

export type PlayerEvents = {
  onComplete?: VoidFunction;
  onPause?: VoidFunction;
  onPlay?: VoidFunction;
  onUpdate?: (progress: number) => void;
};

export const player = (events?: PlayerEvents): any => {
  const emitter = emit<number>();
  let frame: null | number = null;

  const loop = (duration: number, from: number, start: number) => {
    const initial = from * duration;
    const range: Range = [0, duration];
    events?.onPlay?.();

    const getDelta = (now: number) => now - start;
    const getProgress = (delta: number) => progress(delta + initial, range);

    return new Promise((resolve) => {
      const recurse = I(getDelta)
        .I(getProgress)
        .I(tap(emitter.emit))
        .I(tap(events?.onUpdate))
        .I((p: number) => {
          if (p < 1) {
            frame = requestAnimationFrame(() => recurse(performance.now()));
          } else {
            frame = null;
            events?.onComplete?.();
            resolve();
          }
        });

      recurse(performance.now());
    });
  };

  return {
    play: (args: { from?: number; duration?: number }) => {
      const duration = args.duration || 300;
      const from = args.from || 0;
      return loop(duration, from, performance.now());
    },
    pause: () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
        events?.onPause?.();
      }
    },
    subscribe: emitter.subscribe,
  };
};

/**
const { subscibe, play, pause } = player({
  onPlay: () => send({type: 'AnimationStart' }),
  onUpdate,
  onComplete: () => send({type: 'AnimationComplete' }),
  onPause
});


const normal = sequence({
  anim1: {},
  anim2: {},
  anim3: {}
})

const Component = (controller) => {
  useEffect(() => normal.subscribe(// DOM manipulations), []);
  useEffect(() => constroller.subscribe(normal.progress), [controller]);

  return <div
    onClick={() => controller.play({
      from: normal.getProgress(),
      duration: normal.duration()
    })}
    onMouseMove={() => {
      normal.progress(|0 - 1|)
    }}
  />
};
*/
