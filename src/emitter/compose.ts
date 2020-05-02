export interface Composable<A, B> {
  I: <C>(fn: (b: B) => C) => Composable<A, C>;
  fn: (a: A) => B;
}

export const I = <A, B>(fn_aB: (a: A) => B): Composable<A, B> => {
  return {
    I: <C>(fn_bC: (b: B) => C) => I<A, C>((a: A) => fn_bC(fn_aB(a))),
    fn: (a: A) => fn_aB(a),
  };
};

const numToString = (x: number) => `${x}`;
const toCharacterArray = (x: string) => x.split('');
const joinWithDashes = (x: string[]) => x.join('-');

const pipe = I(numToString).I(toCharacterArray).I(joinWithDashes).fn;
pipe(123); // "1-2-3"
