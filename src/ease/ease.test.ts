import { ease } from './ease';

describe('ease', () => {
  it.each(Object.entries(ease))('%s([0, 1]) -> [0, 1]', (key, easeFn) => {
    expect(Math.abs(Math.round(easeFn(0)))).toEqual(0);
    expect(Math.round(easeFn(1))).toEqual(1);
  });
});
