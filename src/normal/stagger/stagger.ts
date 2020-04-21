import { Normal } from '../types';
import { emitter } from './emitter';

type Config = {};

export const stagger = <T extends Normal<any>>(config: Config): Normal<T[]> => {
  const subscription = emitter<T[]>();

  return {
    duration: () => {
      return 300;
    },
    progress: (p: number) => {
      console.log(p);
      return [];
    },
    subscribe: subscription.subscribe,
  };
};
