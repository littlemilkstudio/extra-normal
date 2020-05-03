import { I, tap } from './pipe';

describe('I()', () => {
  it('returns the function its passed', () => {
    const fn = (v: number) => `${v}`;
    expect(I(fn)(5)).toEqual('5');
  });

  it('can chain multiple functions in order of insertiona', () => {
    const op1 = (v: number) => `${v}`;
    const op2 = (v: string) => v.split('');
    const op3 = (v: string[]) => v.join('-');
    expect(I(op1).I(op2).I(op3)(123)).toEqual('1-2-3');
  });
});

describe('tap', () => {
  it('returns the value that was input', () => {
    expect(tap()(5)).toEqual(5);
  });

  it('calls the effect is has for input', () => {
    const effect = jest.fn();
    tap(effect)(5);
    expect(effect).toHaveBeenCalledTimes(1);
    expect(effect).toHaveBeenCalledWith(5);
  });
});
