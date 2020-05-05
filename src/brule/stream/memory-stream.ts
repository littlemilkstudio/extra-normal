import { emit } from '../emit';
import { compose, tap } from '../pipe';

type Next = () => void;
type Observer = {
  error?: VoidFunction;
  next: Next;
  complete?: VoidFunction;
};

type Unobserve = VoidFunction;
type Observable = {
  observe: (observer?: any, intitial?: any) => Unobserve;
};

export const stream = <A, B>(next: (a: A) => B) => {
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
 * type Controller = {
 *  observe: (next, initialValue) -> unobserve,
 *  next?
 *  complete?
 * }
 */

/**
 * const controller = <T>() => {
 *   let observer = null;
 *   const getObserver = () => {
 *      return observer;
 *   }
 *   const setObserver = (newObserver) => {
 *      observer = newObserver;
 *   }
 *
 *   const complete = () => {
 *    getObserver()?.complete?.()
 *    setObserver(null);
 *   };
 *
 *   return {
 *     observe: newObserver => {
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
  const drag = controller<number>();
  const streamNormal = stream(value(clamp)(R_N));
 
  useEffect(() => 
    ['dragging'].includes(state) &&
    stream.source(drag);
  , [state]);

  useEffect(() => 
    ['animating'].includes(state) && 
    stream
      .source(animate)
      .complete(send('ANIMATION_COMPLETE'));
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
