import { clamp, lerp, NORMAL } from 'calc';
import { Ease, ease } from 'ease';
import { emitter } from 'emitter';
import { Normal } from '../types';

type Value = {
  [k: string]: number;
};
type ShapeOf<T> = {
  [k in keyof T]: number;
};
type Config<T> = {
  duration?: number;
  ease?: Ease;
  from: T;
  to: T extends Value ? ShapeOf<T> : number;
};
type ConditionalConfig<T> = T extends Value ? Config<T> : Config<number>;

const isNumberConfig = <T extends Value | number>(
  config: Config<T | number>
): config is Config<number> => {
  return typeof config.from === 'number';
};

const interpolator = <T>(config: ConditionalConfig<T>) => (
  v: number
): ShapeOf<T> | number => {
  const clamped = clamp(v, NORMAL);
  const eased = (config.ease || ease.linear)(clamped);

  return isNumberConfig(config)
    ? lerp(config.from, config.to, eased)
    : Object.keys(config.from).reduce<ShapeOf<T>>((value, prop) => {
        const key = prop as keyof T;
        value[key] = lerp(
          ((config.from as T)[key] as any) as number,
          (config.to as ShapeOf<T>)[key],
          eased
        );
        return value;
      }, {} as ShapeOf<T>);
};

export function tween(config: Config<number>): Normal<number>;
export function tween<T extends Value>(config: Config<T>): Normal<ShapeOf<T>>;
export function tween<T>(
  config: ConditionalConfig<T>
): Normal<ShapeOf<T> | number> {
  const subscription = emitter<ShapeOf<T> | number>();

  return {
    duration: () => config.duration || 300,
    progress: (v) => {
      const interpolated = interpolator(config)(v);
      subscription.emit(interpolated);
      return interpolated;
    },
    subscribe: subscription.subscribe,
  };
}
