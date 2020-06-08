import { Callbag, start, Signal } from 'brule';

export type PlayOptions = {
  reverse?: boolean;
  yoyo?: boolean;
};

/**
 * playing events here?
 */
export type AnimatorOptions = {
  deferred?: boolean;
};

export interface Animator {
  (sink: Callbag<number>): VoidFunction;
  pause: VoidFunction;
  reverse: VoidFunction;
  resume: (opts?: PlayOptions) => Promise<void>;
  reset: VoidFunction;
  stop: VoidFunction;
}

export const animator = (opts?: PlayOptions) => {
  console.log(opts);

  const apply = ((sink: Callbag<number>) => {
    sink(
      start((signal: Signal<number>) => {
        if (signal.isPush) {
          /**
           * Initiate animation loop to start with
           * initial duration supplied by memory
           * sink.
           */
        }
        if (signal.isStart) {
          /**
           * Start animation loop with initial duration?
           * look to if deferred is specified in initialization.
           */
        }
        if (signal.isStop) {
          /**
           * Cancel all processes.
           */
        }
      })
    );
  }) as Animator;

  apply.play = (opts) => {
    console.log(opts);
    return new Promise((res) => res());
  };

  apply.pause = () => {
    return;
  };

  return apply;
};
