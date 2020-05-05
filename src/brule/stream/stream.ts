import { emit } from '../emit';
import { compose, tap } from '../pipe';
import { clamp } from 'calc';

type Observer<T = any, U = any> = {
  error?: VoidFunction;
  next: (v: T) => U;
  complete?: VoidFunction;
};

type Unobserve = VoidFunction;
type Observable<T = any> = {
  observe: (
    observer: Observer<T> | Observer<T>['next'],
    intitial?: T
  ) => Unobserve;
};

export const memoryStream = <A, B>(next: (a: A) => B) => {
  const emitter = emit<B>();

  let unobserve: Unobserve = () => null;
  const getUnobserve = () => {
    return unobserve;
  };
  const setUnobserve = (complete: Unobserve) => {
    unobserve = complete;
  };

  let latest: A | null = null;
  const getLatest = () => {
    return latest;
  };
  const setLatest = (a: A) => {
    latest = a;
  };

  const configuredNext = compose(tap(setLatest)).I(next).I(tap(emitter.emit));

  return {
    source: compose((observable: Observable) => observable)
      .I(tap(getUnobserve()))
      .I((observable: Observable) => {
        setUnobserve(observable.observe(configuredNext, getLatest()));
        return getUnobserve();
      }),
    subscribe: compose(emitter.subscribe),
  };
};

/**
 * const someObservable = observable(({ next, complete, error }) => {
 *    const interval = setInterval(() => next('ping!'), 100);

      return {
        stop: () => clearInterval(interval)
      };
 * });

   const bar = somObervable.observe({
     next: console.log,
   });

   bar.stop();
 */

const observable = <T extends Record<string, any>>(rx: (o: Observer) => T) => ({
  observe: (observer: Observer | Observer['next']) => {
    return typeof observer === 'function'
      ? { ...rx({ next: observer }) }
      : { ...rx(observer) };
  },
});

const unicast = <T = any>(): Observer<T> & Observable<T> => {
  let observer: Observer<T> | null = null;
  const getObserver = () => {
    return observer;
  };
  const setObserver = (
    newObserver: Observer<T> | Observer<T>['next'] | null
  ) => {
    getObserver()?.complete?.();
    observer =
      typeof newObserver === 'function' ? { next: newObserver } : newObserver;
  };

  const complete = () => {
    setObserver(null);
  };

  return {
    observe: (newObserver: Observer<T> | Observer<T>['next']) => {
      setObserver(newObserver);
      return complete;
    },
    next: compose((v: T) => getObserver()?.next(v)),
    complete,
  };
};

const drag = unicast<number>();
const normalStream = memoryStream((v: number) => clamp(v, [0, 1]));

normalStream.source(drag);
normalStream.subscribe((v) => v + 1);

drag.next(1);
drag.complete?.();

/**
 * type Controller = {
 *  observe: (next, initialValue) -> unobserve,
 *  next?
 *  complete?
 * }
 */

/**
 * rx: Observer -> Observer?
 *
 * const observable = (rx) => {
 *   return {
 *    observe: observer => rx(observer):
 *   }
 * };
 *
 * const someObservable = observable(({ error, next, complete }) => {
 *
 * });
 *
 * const unicast = <T>(rx) => {
 *   let observer = null;
 *   const getObserver = () => {
 *      return observer;
 *   }
 *   const setObserver = (newObserver) => {
 *      observer = newObserver;
 *   }
 *
 *   const complete = () => {
 *    rx.complete()
 *    getObserver()?.complete?.()
 *    setObserver(null);
 *   };
 *
 *   return {
 *     observe: (newObserver) => {
 *      complete();
 *      setObserver(newObserver);
 *      return complete;
 *     }
 *     next: (v: T) => getObserver()?.next(v),
 *     complete;
 *   }
 * }
 */

/**
  const animate = player();
  const drag = unicast<number>();
  const streamNormal = stream(value(clamp)(R_N));
 
  useEffect(() => 
    ['dragging'].includes(state) &&
    stream.source(drag);
  , [state]);

  useEffect(() => 
    ['animating'].includes(state) && 
    stream
      .source(animate({
        complete: () => send('ANIMATION_COMPLETE')
      }))
  , [state]);

  useEffect(() => 
    stream
      .subscribe(
        compose(v => v.anim1)
        .I(anim1 => {
          document.style.setProperty('--anim1-progress', anim1);
        })
      )
  , []);

  subscribe((v => v.anim1)())

  useEffect(() => {
    const handleMove = drag.next.O(
      compose(e => e.mouse.pageY)
      .I( value(progress)([0, DISTANCE]) )
    );

    const handleUp = drag.complete.O(
      () => send('DRAG_COMPLETE');
    );

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseup', handleMove, { passive: true });
    return () => {
      doucment.removeEventListener('mousemove', handleMove, { passive: true });
      doucment.removeEventListener('mouseup', handleMove, { passive: true });
    }
  }, []);

  return (
    <div
      onClick={() => send('PLAY')}
      onMouseDown={
        compose(e => e.mouse.pageY)
        .I(y => send('DRAG_START', y))
      }
    />
  );
 */
