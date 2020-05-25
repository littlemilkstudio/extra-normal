import { Callbag, push, Signal, start, stop } from 'brule';

export interface Controller<T> {
  (sink: Callbag<T>): VoidFunction;
  next: (v: T) => void;
}

export const controller = <A, B>(op: (a: A) => B) => {
  let pushToSource: ((v: A) => void) | null = null;
  let terminateSouce: VoidFunction | null = null;

  const source = (signal: Signal<B>) => {
    if (!signal.isStart) return;
    pushToSource = (v: A) => signal.talkback(push(op(v)));
    terminateSouce = () => signal.talkback(stop());
    signal.talkback(
      start((s: Signal<B>) => {
        if (s.isStop) {
          pushToSource = null;
          terminateSouce = null;
        }
      })
    );
  };

  const apply = (sink: Callbag<B>) => {
    source(start(sink));
    return terminateSouce;
  };

  apply.next = (v: A) => {
    pushToSource?.(v);
  };

  return apply;
};
