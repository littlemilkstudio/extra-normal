export type Subscriber<T> = (v: T) => void;
export type Unsubscribe = () => void;
export type Subscribe<T> = (subscriber: Subscriber<T>) => Unsubscribe;
export type Emittion<T> = (v: T) => void;
export type Emit<T> = {
  emit: Emittion<T>;
  subscribe: Subscribe<T>;
};

export const emit = <T>(): Emit<T> => {
  const subscriptions = new Map<symbol, Subscriber<T>>();

  return {
    emit: (v: T) => {
      subscriptions.forEach((subscriber) => {
        subscriber(v);
      });
    },
    subscribe: (subscriber) => {
      const key = Symbol();
      subscriptions.set(key, subscriber);
      return (): void => {
        subscriptions.delete(key);
      };
    },
  };
};
