import { Subscribe } from 'brule';

/**
 * ### Normal
 *
 * A subscribable interpolator that uses a time
 * based interface to describe it's interpolation.
 *
 * **returns**
 * - `duration(): number`
 * - `progress(|0 - 100|): void`
 * - `subscribe(subscriber): unsubscribe`
 */
export type Normal<T> = {
  /**
   * **duration()**
   *
   * - Returns the `duration` of `Normal` in `ms`.
   */
  duration: () => number;
  /**
   * **progress(|0 - 1|)**
   *
   * - Returns interpolated `progress` of `Normal`
   * - Emits interpolated `progress` to subscribers
   */
  progress: (v: number) => T;
  subscribe: Subscribe<T>;
};
