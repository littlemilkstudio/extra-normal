import { emit } from './emit';

describe('emit()', () => {
  it('Can Emit to multiple subscribers', () => {
    const emitter = emit<number>();
    const subscribers = Array.from({ length: 10 }, () => jest.fn());
    subscribers.forEach((subscriber) => {
      emitter.subscribe(subscriber);
    });

    emitter.emit(1);
    subscribers.forEach((subscriber) => {
      expect(subscriber).toBeCalledTimes(1);
    });
  });

  it('Can unsubscribe single subscriber', () => {
    const numSubscribers = 50;
    const unnsubscribedIndex = numSubscribers / 2;

    const emitter = emit<number>();
    const subscribers = Array.from({ length: numSubscribers }, () => jest.fn());

    const unsubscribe = subscribers.map((subscriber) => {
      return emitter.subscribe(subscriber);
    });
    unsubscribe[unnsubscribedIndex]();

    emitter.emit(1);
    subscribers.forEach((subscriber, i) => {
      expect(subscriber).toBeCalledTimes(i === unnsubscribedIndex ? 0 : 1);
    });
  });
});
