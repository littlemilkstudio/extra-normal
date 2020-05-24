import { push, stop, start, pull, Signal, Callbag } from '../callbag';
import { memory } from './memory';

const createLogSink = () => {
  const log: number[] = [];
  const sink = (signal: Signal) => {
    if (signal.isPush) {
      log.push(signal.value);
    }
  };

  return {
    log,
    sink,
  };
};

describe('memory(inputSink)', () => {
  it('is pushable', () => {
    const { log, sink } = createLogSink();
    const memorySink = memory(sink);

    memorySink(push(1));
    memorySink(push(2));
    memorySink(push(3));

    expect(log).toEqual([1, 2, 3]);
  });

  it('pushes memorized value to a source on handshake', () => {
    const { sink } = createLogSink();
    const memorySink = memory(sink);

    memorySink(push(1));
    memorySink(push(2));

    const pushHandler = jest.fn();
    const source = (sinkSignal: Signal) => {
      if (!sinkSignal.isStart) return;
      const talkback = (signal: Signal) => {
        if (signal.isPush) {
          pushHandler(signal.value);
        }
      };
      sinkSignal.talkback(start(talkback));
    };

    source(start(memorySink));
    expect(pushHandler).toHaveBeenCalledWith(2);
  });

  it('sink terminates previously attached sources when started with a new one', () => {
    const { sink } = createLogSink();
    const terminatableSource = (onTerminate: VoidFunction) => (
      sinkSignal: Signal
    ) => {
      if (!sinkSignal.isStart) return;
      const talkback = (signal: Signal) => {
        if (signal.isStop) {
          onTerminate();
        }
      };
      sinkSignal.talkback(start(talkback));
    };

    const memorySink = memory(sink);

    const onTerminate1 = jest.fn();
    const terminatableSource1 = terminatableSource(onTerminate1);
    const onTerminate2 = jest.fn();
    const terminatableSource2 = terminatableSource(onTerminate2);

    terminatableSource1(start(memorySink));
    terminatableSource2(start(memorySink));

    expect(onTerminate1).toHaveBeenCalledTimes(1);
    expect(onTerminate2).toHaveBeenCalledTimes(0);
  });

  it('can terminate a relatinship from the source', () => {
    let terminateFromSink: VoidFunction = () => null;
    const sink = (signal: Signal) => {
      if (!signal.isStart) return;
      terminateFromSink = () => signal.talkback(stop());
    };

    let terminateFromSource: VoidFunction = () => null;
    const onSourceTerminate = jest.fn();
    const source = (sinkSignal: Signal) => {
      if (!sinkSignal.isStart) return;
      terminateFromSource = () => sinkSignal.talkback(stop());
      const talkback = (signal: Signal) => {
        if (signal.isStop) {
          onSourceTerminate();
        }
      };
      sinkSignal.talkback(start(talkback));
    };

    const memorySink = memory(sink);
    source(start(memorySink));
    terminateFromSource();
    terminateFromSink();
    expect(onSourceTerminate).toHaveBeenCalledTimes(0);
  });

  it('can terminate a relationship from the sink', () => {
    let terminateFromSink: VoidFunction = () => null;
    const terminatableSink = (signal: Signal) => {
      if (!signal.isStart) return;
      terminateFromSink = () => signal.talkback(stop());
    };

    const onSourceTerminate = jest.fn();
    let terminateFromSource: VoidFunction = () => null;
    const source = (sinkSignal: Signal) => {
      if (!sinkSignal.isStart) return;
      const talkback = (signal: Signal) => {
        if (signal.isStart) {
          terminateFromSource = () => signal.talkback(stop());
        }
        if (signal.isStop) {
          onSourceTerminate();
        }
      };
      sinkSignal.talkback(start(talkback));
    };

    const memorySink = memory(terminatableSink);
    source(start(memorySink));

    terminateFromSink();
    terminateFromSink();
    terminateFromSink();
    terminateFromSource();

    expect(onSourceTerminate).toHaveBeenCalledTimes(1);
  });

  it('sink cant communicate anything other than terminate to source', () => {
    let pushFromSink: VoidFunction = () => null;
    let pullFromSink: VoidFunction = () => null;
    let startFromSink: VoidFunction = () => null;
    const terminatableSink = (signal: Signal) => {
      if (!signal.isStart) return;
      startFromSink = () => signal.talkback(start((() => null) as Callbag));
      pullFromSink = () => signal.talkback(pull());
      pushFromSink = () => signal.talkback(push(5));
    };

    const memorySink = memory(terminatableSink);

    const onSourceTerminate = jest.fn();
    const source = (sinkSignal: Signal) => {
      if (!sinkSignal.isStart) return;
      const talkback = (signal: Signal) => {
        if (signal.isStop) {
          onSourceTerminate();
        }
      };
      sinkSignal.talkback(start(talkback));
    };

    source(start(memorySink));
    startFromSink();
    pullFromSink();
    pushFromSink();
    expect(onSourceTerminate).toHaveBeenCalledTimes(0);
  });
});
