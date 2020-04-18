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
type TweenConfig<T> = {
  duration?: number;
  ease?: Ease;
  from: T;
  to: T extends Value ? ShapeOf<T> : number;
};

const isNumberConfig = <T extends Value | number>(
  config: TweenConfig<T | number>
): config is TweenConfig<number> => {
  return typeof config.from === 'number';
};

export function tween(config: TweenConfig<number>): Normal<number>;
export function tween<T extends Value>(
  config: TweenConfig<T>
): Normal<ShapeOf<T>>;

export function tween<T>(
  config: T extends Value ? TweenConfig<T> : TweenConfig<number>
): Normal<ShapeOf<T> | number> {
  const duration = config.duration || 300;
  const easing = config.ease || ease.linear;

  const subscription = emitter<ShapeOf<T> | number>();

  const interpolate = (v: number): ShapeOf<T> | number => {
    const clamped = clamp(v, NORMAL);
    const eased = easing(clamped);

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

  return {
    duration: (): number => duration,
    progress: (v): ShapeOf<T> | number => {
      const interpolated = interpolate(v);
      subscription.emit(interpolated);
      return interpolated;
    },
    subscribe: subscription.subscribe,
  };
}
