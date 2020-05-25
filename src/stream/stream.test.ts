import { push } from '../brule';
import { stream } from './stream';

describe('stream(op)', () => {
  it('doesnt call the operation until stream is started', () => {
    const testFn = jest.fn();
    const op = (v: number) => (testFn(), v);
    const s = stream(op);
    s(push(5));

    expect(testFn).toHaveBeenCalledTimes(0);
  });

  it('pushes values through operation to listener', () => {
    const listener = jest.fn();
    const s = stream((v: number) => v * 2);
    s.start((v) => listener(v));

    s(push(10));
    expect(listener).toHaveBeenCalledWith(20);
  });

  it('is stopable', () => {
    const listener = jest.fn();
    const s = stream((v: number) => v);
    const stop = s.start((v) => listener(v));
    s(push(1));
    expect(listener).toHaveBeenCalledTimes(1);
    stop();
    s(push(2));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
