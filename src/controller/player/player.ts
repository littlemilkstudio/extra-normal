import { emit, I, tap } from 'brule';
import { progress, Range } from 'calc';

export type PlayerEvents = {
  onComplete?: VoidFunction;
  onPause?: VoidFunction;
  onPlay?: VoidFunction;
  onUpdate?: (progress: number) => void;
};

export const player = (events?: PlayerEvents) => {
  const emitter = emit<number>();
  let frame: null | number = null;

  const loop = (duration: number, from: number, start: number) => {
    const initial = from * duration;
    const range: Range = [0, duration];
    events?.onPlay?.();

    const getDelta = (now: number) => now - start;
    const getProgress = (delta: number) => progress(delta + initial, range);

    return new Promise<void>((resolve) => {
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
    play: (args?: { from?: number; duration?: number }): Promise<void> => {
      const duration = args?.duration || 300;
      const from = args?.from || 0;
      return loop(duration, from, performance.now());
    },
    pause: () => {
      events?.onPause?.();
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    },
    subscribe: emitter.subscribe,
  };
};
/**
 * - Normal is a memory stream. holds onto duration and previous progress.
 * - can only observe one source at a time.
 */

/**
 * - Controllers are observables
 */

/**
const anim1 = emitter();

const memoryStream = normal
  .interpolate
  .I(sequence => sequence.anim1)
  .I(tap(anim1.emit));

memoryStream({
  next: normal.interpolate
})(
  .next() // composable
  .observing()

const Component = () => {
  const [current, send] = useMachine(machine, 'idle');

  const animate = player({
    onStart,
    onNext,
    onComplete
  });

  const drag = (events) => {
    let observing = false;

    const complete = () => {
      events?.onComplete?.();
      observing = false;
      oberver.unobserve()
    }

    const setObserver = () => {
      observer.unobserve();
      observer.setUnobserve(() => isObserving() && complete());
    }

    return {
      observe: ({ next, error, complete }) => {
        const current = oberver.current();
        events?.onStart();
        setObserver(observer);
      },
      next: compose(v => isObserving() && observer.next(v)),
      complete 
    }
  };
  const drag();

  useEffect(() => {
    if (['dragging'].includes(state)) {
      retrun drag.observe(stream);
    }
  }, [state]);

  useEffect(() => {
    if (['animating'].includes(state)) {
      retrun animate.observe(stream);
    }
  }, [state]);

  return (
    <div
      onClick={() => send('PLAY')}
      onMouseOver={() => send('START_DRAGGING', 0)}
      onMouseMove={() => drag.next.o(
        composer(e => e.mouse.pageY)
        .I(v(progress([0, DISTANCE])))
      )}
    />
  );
};
*/
