import { emitter } from './emitter';

describe('emitter()', () => {
  it('Can Emit to multiple subscribers', () => {
    const stream = emitter<number>();
    const subscribers = Array.from({ length: 10 }, () => jest.fn());
    subscribers.forEach((subscriber) => {
      stream.subscribe(subscriber);
    });

    stream.next(1);
    subscribers.forEach((subscriber) => {
      expect(subscriber).toBeCalledTimes(1);
    });
  });

  it('Can unsubscribe single subscriber', () => {
    const numSubscribers = 50;
    const unnsubscribedIndex = numSubscribers / 2;

    const stream = emitter<number>();
    const subscribers = Array.from({ length: numSubscribers }, () => jest.fn());

    const unsubscribe = subscribers.map((subscriber) => {
      return stream.subscribe(subscriber);
    });
    unsubscribe[unnsubscribedIndex]();

    stream.next(1);
    subscribers.forEach((subscriber, i) => {
      expect(subscriber).toBeCalledTimes(i === unnsubscribedIndex ? 0 : 1);
    });
  });
});
