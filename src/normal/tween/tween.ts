import { emit, I, tap } from 'brule';
import { clamp, lerp, NORMAL } from 'calc';
import { Ease, ease } from 'ease';
import { Normal } from '../types';

export type Value = {
  [k: string]: number;
};
export type ShapeOf<T> = {
  [k in keyof T]: number;
};
export type Config<T> = {
  duration?: number;
  ease?: Ease;
  from: T;
  to: T extends Value ? ShapeOf<T> : number;
};
type ConditionalConfig<T> = T extends Value ? Config<T> : Config<number>;

const isNumberConfig = (config: any): config is Config<number> => {
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
  const emitter = emit<ShapeOf<T> | number>();
  const configured = {
    interpolator: interpolator(config),
  };

  return {
    duration: () => config.duration || 300,
    progress: I((p: number) => clamp(p, NORMAL))
      .I(configured.interpolator)
      .I(tap(emitter.emit)),
    subscribe: emitter.subscribe,
  };
}
