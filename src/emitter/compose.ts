export interface Composable<A, B> {
  I: <C>(fn: (b: B) => C) => Composable<A, C>;
  O: (a: A) => B;
}

export const I = <A, B>(source: (a: A) => B): Composable<A, B> => {
  return {
    I: <C>(consumer: (b: B) => C) => I<A, C>((a: A) => consumer(source(a))),
    O: source,
  };
};

const numToString = (x: number) => `${x}`;
const toCharacterArray = (x: string) => x.split('');
const joinWithDashes = (x: string[]) => x.join('-');

const pipe = I(numToString).I(toCharacterArray).I(joinWithDashes).O;
pipe(123); // "1-2-3"
