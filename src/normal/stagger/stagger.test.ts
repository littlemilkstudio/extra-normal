import { tween } from '../tween';
import { stagger } from './stagger';

describe('stagger', () => {
  it('Calculates duration for number staggers', () => {
    expect(
      stagger({
        length: 6,
        stagger: 100,
        normal: tween({
          duration: 500,
          from: 0,
          to: 1,
        }),
      }).duration()
    ).toEqual(1000);
  });

  it('Calculates duration for functional staggers', () => {
    expect(
      stagger({
        length: 8,
        stagger: (i) => (i % 2) * 25,
        normal: tween({
          duration: 500,
          from: 0,
          to: 1,
        }),
      }).duration()
    ).toEqual(500 + 25);
  });

  it('Interpolates correctly', () => {
    const { progress } = stagger({
      length: 4,
      stagger: 100,
      normal: tween({
        duration: 100,
        from: 0,
        to: 1,
      }),
    });
    expect(progress(0)).toEqual([0, 0, 0, 0]);
    expect(progress(0.25)).toEqual([1, 0, 0, 0]);
    expect(progress(0.5)).toEqual([1, 1, 0, 0]);
    expect(progress(0.75)).toEqual([1, 1, 1, 0]);
    expect(progress(1)).toEqual([1, 1, 1, 1]);
  });
});
