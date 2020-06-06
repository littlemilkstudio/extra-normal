import { Callbag, stop, push, pull, start } from 'brule';
import { controller } from './controller';

describe('controller(sink)', () => {
  it('pushes operation result to sink on next', () => {
    const test = jest.fn();
    const sink: Callbag<number> = (signal) => {
      if (signal.isPush) {
        test(signal.value);
      }
    };
    const control = controller((v: number) => v);

    control(sink);
    control.next(5);

    expect(test).toBeCalledTimes(1);
    expect(test).toHaveBeenCalledWith(5);
  });

  it('is cancelable by sink', () => {
    let cancel: VoidFunction = () => null;
    const test = jest.fn();
    const sink: Callbag<number> = (signal) => {
      if (signal.isStart) {
        cancel = () => signal.talkback(stop());
      }
      if (signal.isPush) {
        test(signal.value);
      }
    };
    const control = controller((v: number) => v);

    control(sink);
    cancel();
    control.next(5);

    expect(test).toBeCalledTimes(0);
  });

  it('is cancelable by controller', () => {
    const test = jest.fn();
    const sink: Callbag<number> = (signal) => {
      if (signal.isPush) {
        test(signal.value);
      }
    };
    const control = controller((v: number) => v);
    const cancel = control(sink);

    cancel?.();
    control.next(1);

    expect(test).toBeCalledTimes(0);
  });

  it('doesnt acknowledge any signal but stop signal from sink', () => {
    const test = jest.fn();
    const sink: Callbag<number> = (signal) => {
      if (signal.isPush) {
        test(signal.value);
      }
      /**
       * These should do nothing since controller
       * only exposes stop functionalitu to sink.
       */
      if (signal.isStart) {
        signal.talkback(push(10));
        signal.talkback(pull());
        signal.talkback(start(() => null));
      }
    };
    const control = controller((v: number) => v);

    control(sink);
    control.next(5);

    expect(test).toHaveBeenCalledWith(5);
  });
});
