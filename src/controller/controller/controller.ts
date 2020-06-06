import { Callbag, push, Signal, start, stop } from 'brule';

export interface Controller<T> {
  (sink: Callbag<T>): VoidFunction;
  next: (v: T) => void;
}

export const controller = <A, B>(op: (a: A) => B) => {
  let pushToSource: ((v: A) => void) | null = null;
  let terminateSouce: VoidFunction | null = null;

  const source = (sink: Callbag<B>) => {
    pushToSource = (v: A) => sink(push(op(v)));
    terminateSouce = () => {
      sink(stop());
      pushToSource = null;
      terminateSouce = null;
    };
    sink(
      start((s: Signal<B>) => {
        if (s.isStop) {
          pushToSource = null;
          terminateSouce = null;
        }
      })
    );
  };

  const apply = (sink: Callbag<B>) => {
    source(sink);
    return terminateSouce;
  };

  apply.next = (v: A) => {
    pushToSource?.(v);
  };

  return apply;
};
