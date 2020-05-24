import { I, tap } from '../pipe';
import { Signal, start, stop, push, Callbag } from '../signal';

export const memory = <T>(inputSink: Callbag<T>) => {
  let memorized: T | null = null;
  const setMemorized = (v: T) => (memorized = v);
  const memorizeAndPush = I(tap(setMemorized)).I(push);
  let terminateSource: VoidFunction = () => null;

  /**
   * Establish connection to sink.
   */
  inputSink(
    start((signal: Signal) => {
      /**
       * The only thing a sink can communicate upstream
       * is the termination of a relationship.
       */
      if (!signal.isStop) return;
      terminateSource();
      terminateSource = () => null;
    })
  );

  /**
   * Create output sink.
   */
  return (inputSourceSignal: Signal<T>) => {
    if (inputSourceSignal.isStart) {
      /**
       * Kill existing sources.
       * Make new source cancelable.
       */
      terminateSource();
      terminateSource = () => inputSourceSignal.talkback(stop());

      /**
       * Push memorized value in case source wants
       * to create a driver based off of it.
       */
      memorized && inputSourceSignal.talkback(push(memorized));
      /**
       * Tell source to start up a driver.
       */
      // inputSourceSignal.talkback(start());
    }
    if (inputSourceSignal.isPush) {
      inputSink(memorizeAndPush(inputSourceSignal.value));
    }
    /**
     * Sinks can only be terminated by the sink.
     * terminating a source just means the source
     * no longer controls the sink.
     */
    if (inputSourceSignal.isStop) {
      terminateSource = () => null;
    }
  };
};
