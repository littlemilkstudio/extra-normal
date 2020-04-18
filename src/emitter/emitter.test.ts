import { emitter } from './emitter';

describe('emitter()', () => {
  it('Can Emit to multiple subscribers', () => {
    const subscription = emitter<number>();
    const subscribers = Array.from({ length: 10 }, () => jest.fn());
    subscribers.forEach((subscriber) => {
      subscription.subscribe(subscriber);
    });

    subscription.emit(1);
    subscribers.forEach((subscriber) => {
      expect(subscriber).toBeCalledTimes(1);
    });
  });

  it('Can unsubscribe single subscriber', () => {
    const numSubscribers = 50;
    const unnsubscribedIndex = numSubscribers / 2;

    const subscription = emitter<number>();
    const subscribers = Array.from({ length: numSubscribers }, () => jest.fn());

    const unsubscribe = subscribers.map((subscriber) => {
      return subscription.subscribe(subscriber);
    });
    unsubscribe[unnsubscribedIndex]();

    subscription.emit(1);
    subscribers.forEach((subscriber, i) => {
      expect(subscriber).toBeCalledTimes(i === unnsubscribedIndex ? 0 : 1);
    });
  });
});
