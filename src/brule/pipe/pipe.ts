export type Thoughput<T> = (v: T) => T;

export interface Compose<A, B> {
  (a: A): B;
  I: <C>(fn: (b: B) => C) => Compose<A, C>;
  O: <C>(fn: (c: C) => A) => Compose<C, B>;
}

export const I = <A, B>(op1: (a: A) => B): Compose<A, B> => {
  const apply = op1 as Compose<A, B>;
  apply.I = <C>(op2: (b: B) => C) => I<A, C>((a: A) => op2(op1(a)));
  apply.O = <C>(op2: (c: C) => A) => I<C, B>((c: C) => op1(op2(c)));
  return apply;
};

export const compose = <A, B>(op1: (a: A) => B): Compose<A, B> => {
  const apply = op1 as Compose<A, B>;
  apply.I = <C>(op2: (b: B) => C) => I<A, C>((a: A) => op2(op1(a)));
  apply.O = <C>(op2: (c: C) => A) => I<C, B>((c: C) => op1(op2(c)));
  return apply;
};

export const tap = <T>(effect?: (v: T) => void): Thoughput<T> => {
  return (v: T) => (effect?.(v), v);
};
