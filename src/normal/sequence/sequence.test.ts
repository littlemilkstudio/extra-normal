import { tween } from '../tween';
import { current, normalize, range, sequence } from './sequence';

describe('current(t, offset)', () => {
  it('Returns t if offset not specified', () => {
    expect(current(500)).toEqual(500);
  });
  it('Returns offset if offset is a number', () => {
    expect(current(500, 1000)).toEqual(1000);
  });
  it('Returns the output of offset if offset is a function', () => {
    expect(current(500, (t: number) => t + 50)).toEqual(550);
  });
});

describe('range(config)', () => {
  it('Provides a range from standard config', () => {
    expect(
      range({
        first: {
          normal: tween({ duration: 200, from: 0, to: 1 }),
        },
        second: {
          normal: tween({ duration: 800, from: 0, to: 1 }),
        },
      })
    ).toEqual([0, 1000]);
  });

  it('Provides a range from negative config', () => {
    expect(
      range({
        first: {
          normal: tween({ duration: 200, from: 0, to: 1 }),
        },
        second: {
          offset: -500,
          normal: tween({ duration: 1000, from: 0, to: 1 }),
        },
      })
    ).toEqual([-500, 500]);

    expect(
      range({
        first: {
          normal: tween({ duration: 100, from: 0, to: 1 }),
        },
        second: {
          offset: (t) => t - 500,
          normal: tween({ duration: 500, from: 0, to: 1 }),
        },
      })
    ).toEqual([-400, 100]);
  });
});

describe('normalize(config)', () => {
  it('Returns an object of the same shape of the config', () => {
    expect(
      Object.keys(
        normalize({
          first: {
            normal: tween({ duration: 100, from: 0, to: 1 }),
          },
          second: {
            normal: tween({ duration: 100, from: 0, to: 1 }),
          },
          third: {
            normal: tween({ duration: 100, from: 0, to: 1 }),
          },
        })
      )
    ).toEqual(['first', 'second', 'third']);
  });

  it('Returns an object with normalized ranges', () => {
    expect(
      normalize({
        first: {
          normal: tween({ duration: 100, from: 0, to: 1 }),
        },
        second: {
          normal: tween({ duration: 100, from: 0, to: 1 }),
        },
        third: {
          normal: tween({ duration: 100, from: 0, to: 1 }),
        },
        fourth: {
          normal: tween({ duration: 100, from: 0, to: 1 }),
        },
      })
    ).toEqual({
      first: [0, 0.25],
      second: [0.25, 0.5],
      third: [0.5, 0.75],
      fourth: [0.75, 1],
    });
  });
});

describe('sequence(config)', () => {
  it('Interpolates a standard range', () => {
    const { progress } = sequence({
      first: {
        normal: tween({ duration: 100, from: 0, to: 1 }),
      },
      second: {
        normal: tween({ duration: 100, from: 0, to: 1 }),
      },
    });

    expect(progress(0)).toEqual({ first: 0, second: 0 });
    expect(progress(0.25)).toEqual({ first: 0.5, second: 0 });
    expect(progress(0.5)).toEqual({ first: 1, second: 0 });
    expect(progress(0.75)).toEqual({ first: 1, second: 0.5 });
    expect(progress(1)).toEqual({ first: 1, second: 1 });
  });

  it('Returns the duration with no offset entries', () => {
    const { duration } = sequence({
      first: {
        normal: tween({ duration: 100, from: 0, to: 1 }),
      },
      second: {
        normal: tween({ duration: 100, from: 0, to: 1 }),
      },
    });

    expect(duration()).toEqual(200);
  });

  it('Returns the duration with offset entries', () => {
    const { duration } = sequence({
      first: {
        normal: tween({ duration: 100, from: 0, to: 1 }),
      },
      second: {
        offset: (t) => t - 1000,
        normal: tween({ duration: 100, from: 0, to: 1 }),
      },
    });

    expect(duration()).toEqual(1000);
  });
});
