import { player } from './player';

let cancelAnimationFrameMock: jest.SpyInstance<void, [number]>;
let requestAnimationFrameMock: jest.SpyInstance<number, [FrameRequestCallback]>;
let nowMock: jest.SpyInstance<number, []>;

const setPerfNow = (now: number) => {
  nowMock = jest.spyOn(window.performance, 'now').mockImplementation(() => now);
};

const rafController = (args?: { initialTime?: number }) => {
  let now = args?.initialTime || 0;
  let frameIndex = 0;
  let frameId = 0;
  const queue: Array<Map<number, FrameRequestCallback> | null> = [];

  const getFrameIndex = () => frameIndex;

  setPerfNow(now);
  requestAnimationFrameMock = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb) => {
      const currentFrameIndex = getFrameIndex();
      if (!queue[currentFrameIndex]) {
        queue[currentFrameIndex] = new Map<number, FrameRequestCallback>();
      }
      frameId += 1;
      queue[currentFrameIndex]?.set(frameId, cb);
      return frameId;
    });

  cancelAnimationFrameMock = jest
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation((frameId) => {
      const currentFrameIndex = getFrameIndex();
      queue[currentFrameIndex]?.delete(frameId);
    });

  return {
    executeRafAt: (ms: number) => {
      now = ms;
      setPerfNow(now);
      const lastFrame = frameIndex;
      /**
       * Set up new frame in case callbacks call rAF
       */
      frameIndex += 1;
      /**
       * Call each fn queued for the current frame and clear it after.
       */
      queue[lastFrame]?.forEach((cb) => cb(now));
      queue[lastFrame]?.clear();
    },
  };
};

afterEach(() => {
  nowMock?.mockRestore();
  requestAnimationFrameMock?.mockRestore();
  cancelAnimationFrameMock?.mockRestore();
});

describe('player()', () => {
  it('calls onPlay when starts', () => {
    rafController();
    const handlePlay = jest.fn();
    const { play } = player({
      onPlay: handlePlay,
    });

    play();
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdate() on each update', () => {
    const controller = rafController();
    const handleUpdate = jest.fn();
    const { play } = player({
      onUpdate: handleUpdate,
    });

    const duration = 300;
    play({ duration });
    expect(handleUpdate).toHaveBeenCalledTimes(1);
    expect(handleUpdate).toHaveBeenCalledWith(0);

    const timeStamp = 200;
    controller.executeRafAt(timeStamp);
    expect(handleUpdate).toHaveBeenCalledTimes(2);
    expect(handleUpdate).toHaveBeenCalledWith(timeStamp / duration);
  });

  it('calls onComplete() once when anim completes', () => {
    const controller = rafController();
    const handleComplete = jest.fn();
    const { play } = player({
      onComplete: handleComplete,
    });

    play({ duration: 300 });
    expect(handleComplete).toHaveBeenCalledTimes(0);

    controller.executeRafAt(400);
    expect(handleComplete).toHaveBeenCalledTimes(1);

    controller.executeRafAt(500);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('calls onPause() when anim gets paused', () => {
    const controller = rafController();
    const handlePause = jest.fn();
    const { pause, play } = player({
      onPause: handlePause,
    });

    play({ duration: 300 });
    expect(handlePause).toHaveBeenCalledTimes(0);

    pause();
    controller.executeRafAt(200);
    expect(handlePause).toHaveBeenCalledTimes(1);

    controller.executeRafAt(500);
    expect(handlePause).toHaveBeenCalledTimes(1);
  });

  it('doesnt error when onPause() gets called before play()', () => {
    const handlePause = jest.fn();
    const { pause } = player({
      onPause: handlePause,
    });

    expect(pause).not.toThrow();
  });

  it('doesnt error when onPause() gets called before play()', () => {
    const handlePause = jest.fn();
    const { pause } = player({
      onPause: handlePause,
    });

    expect(pause).not.toThrow();
  });

  it('calls promise when play() completes', () => {
    const controller = rafController();
    const handlePromise = jest.fn();
    const { play } = player();

    const duration = 300;
    const playPromise = play({ duration }).then(handlePromise);
    expect(handlePromise).toHaveBeenCalledTimes(0);

    controller.executeRafAt(duration);
    return playPromise.then(() => {
      expect(handlePromise).toHaveBeenCalledTimes(1);
    });
  });
});
