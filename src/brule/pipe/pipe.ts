export type Thoughput<T> = (v: T) => T;

export interface Pipe<A, B> {
  (a: A): B;
  I: <C>(fn: (b: B) => C) => Pipe<A, C>;
}

export const I = <A, B>(op1: (a: A) => B): Pipe<A, B> => {
  const apply = op1 as Pipe<A, B>;
  apply.I = <C>(op2: (b: B) => C) => I<A, C>((a: A) => op2(op1(a)));
  return apply;
};

export const tap = <T>(effect?: (v: T) => void): Thoughput<T> => {
  return (v: T) => (effect?.(v), v);
};
