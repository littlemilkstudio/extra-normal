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

  it('Interpolates an object', () => {
    const from = {
      propertyOne: 33,
      propertyTwo: 200,
    };
    const to = {
      propertyOne: 50,
      propertyTwo: 750,
    };
    const { progress } = tween({
      from,
      to,
    });

    expect(progress(0)).toEqual(from);
    expect(progress(1)).toEqual(to);
  });

  it('Defaults duration to 300ms', () => {
    const { duration } = tween({
      from: 0,
      to: 1,
    });

    expect(duration()).toEqual(300);
  });

  it('Returns a duration', () => {
    const ms = 500;
    const { duration } = tween({
      duration: ms,
      from: 0,
      to: 1,
    });

    expect(duration()).toEqual(ms);
  });
});
