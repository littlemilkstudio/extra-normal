import { I, memory, Signal, stop } from '../brule';

interface Stream<A, B> {
  (signal: Signal<A>): void;
  start: (fn: (value: B) => void) => VoidFunction;
}

export const stream = <A, B>(op: (a: A) => B): Stream<A, B> => {
  let terminate: VoidFunction | null = null;
  let listener: ((value: B) => void) | null = null;

  const apply = memory((signal: Signal<A>) => {
    if (signal.isStart) {
      terminate = () => signal.talkback(stop());
    }
    if (signal.isPush) {
      listener && I(op).I(listener)(signal.value);
    }
  }) as Stream<A, B>;

  apply.start = (l: (value: B) => void) => {
    listener = l;
    return () => {
      terminate?.();
      terminate = null;
      listener = null;
    };
  };

  return apply;
};
