import { tween } from './tween';

describe('tween(config)', () => {
  it('Interpolates single values', () => {
    const from = 33;
    const to = 50;
    const { progress } = tween({
      from,
      to,
    });

    expect(progress(0)).toEqual(from);
    expect(progress(1)).toEqual(to);
  });
});
