import { lerp } from './lerp';

describe('lerp(initial, target, progress)', () => {
  it('Equals `target` when `progress === 1`', () => {
    const target = 69;
    expect(lerp(0, target, 1)).toEqual(target);
  });

  it('Equals `initial` when `progress === 0`', () => {
    const initial = 69;
    expect(lerp(initial, 0, 0)).toEqual(initial);
  });

  it('Calculates normal range properly', () => {
    const initial = 0;
    const target = 100;
    expect(lerp(initial, target, 0.25)).toEqual(25);
    expect(lerp(initial, target, 0.5)).toEqual(50);
    expect(lerp(initial, target, 0.75)).toEqual(75);
  });

  it('Calculates reverse range properly', () => {
    const initial = 100;
    const target = 0;
    expect(lerp(initial, target, 0.25)).toEqual(75);
    expect(lerp(initial, target, 0.5)).toEqual(50);
    expect(lerp(initial, target, 0.75)).toEqual(25);
  });
});
