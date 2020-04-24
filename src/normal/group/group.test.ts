import { group } from './group';
import { tween } from '../tween';

describe('group(config)', () => {
  it('Calculates duration as duration of the longest entry', () => {
    const { duration } = group({
      one: tween({
        duration: 500,
        from: 0,
        to: 1,
      }),
      two: tween({
        duration: 1000,
        from: 0,
        to: 1,
      }),
      three: tween({
        duration: 200,
        from: 0,
        to: 1,
      }),
    });
    expect(duration()).toEqual(1000);
  });

  it('Interpolates to object of the same shape correctly', () => {
    const { progress } = group({
      one: tween({
        duration: 250,
        from: 0,
        to: 1,
      }),
      two: tween({
        duration: 500,
        from: 0,
        to: 1,
      }),
      three: tween({
        duration: 1000,
        from: {
          property: 0,
        },
        to: {
          property: 1,
        },
      }),
    });

    expect(progress(0)).toEqual({
      one: 0,
      two: 0,
      three: {
        property: 0,
      },
    });

    expect(progress(0.25)).toEqual({
      one: 1,
      two: 0.5,
      three: {
        property: 0.25,
      },
    });

    expect(progress(0.5)).toEqual({
      one: 1,
      two: 1,
      three: {
        property: 0.5,
      },
    });

    expect(progress(0.75)).toEqual({
      one: 1,
      two: 1,
      three: {
        property: 0.75,
      },
    });

    expect(progress(1)).toEqual({
      one: 1,
      two: 1,
      three: {
        property: 1,
      },
    });
  });
});
