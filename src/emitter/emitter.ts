export type Subscriber<T> = (v: T) => void;
export type Unsubscribe = () => void;
export type Subscribe<T> = (subscriber: Subscriber<T>) => Unsubscribe;
export type Emit<T> = (v: T) => void;
export type Emitter<T> = {
  emit: Emit<T>;
  subscribe: Subscribe<T>;
};

export const emitter = <T>(): Emitter<T> => {
  const subscriptions = new Map<symbol, Subscriber<T>>();

  const subscribe: Subscribe<T> = (subscriber) => {
    const key = Symbol();
    subscriptions.set(key, subscriber);
    return (): void => {
      subscriptions.delete(key);
    };
  };

  const emit: Emit<T> = (v) => {
    subscriptions.forEach((subscriber) => {
      subscriber(v);
    });
  };

  return {
    emit,
    subscribe,
  };
};
