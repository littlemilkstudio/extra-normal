import { clamp, progress, Range, transform } from './range';

describe('clamp(range)(v)', () => {
  it('Clamps to upper bound', () => {
    const range: Range = [-50, 50];
    const inverseRange: Range = [50, -50];
    expect(clamp(range)(100)).toEqual(range[1]);
    expect(clamp(inverseRange)(100)).toEqual(inverseRange[0]);
  });

  it('Clamps to lower bound', () => {
    const range: Range = [-50, 50];
    const inverseRange: Range = [50, -50];
    expect(clamp(range)(-100)).toEqual(range[0]);
    expect(clamp(inverseRange)(-100)).toEqual(inverseRange[1]);
  });
});

describe('progress(range)(v)', () => {
  it('Calculates progress in standard range', () => {
    const getProgress = progress([0, 100]);
    expect(getProgress(0)).toEqual(0);
    expect(getProgress(25)).toEqual(0.25);
    expect(getProgress(50)).toEqual(0.5);
    expect(getProgress(75)).toEqual(0.75);
    expect(getProgress(100)).toEqual(1);
  });

  it('Calculates progress in inverse range', () => {
    const getProgress = progress([100, 0]);
    expect(getProgress(100)).toEqual(0);
    expect(getProgress(75)).toEqual(0.25);
    expect(getProgress(50)).toEqual(0.5);
    expect(getProgress(25)).toEqual(0.75);
    expect(getProgress(0)).toEqual(1);
  });

  it('Calculates progress in negative range', () => {
    const getProgress = progress([-100, 0]);
    expect(getProgress(-100)).toEqual(0);
    expect(getProgress(-75)).toEqual(0.25);
    expect(getProgress(-50)).toEqual(0.5);
    expect(getProgress(-25)).toEqual(0.75);
    expect(getProgress(0)).toEqual(1);
  });

  it('Calculates progress in negative inverse range', () => {
    const getProgress = progress([0, -100]);
    expect(getProgress(0)).toEqual(0);
    expect(getProgress(-25)).toEqual(0.25);
    expect(getProgress(-50)).toEqual(0.5);
    expect(getProgress(-75)).toEqual(0.75);
    expect(getProgress(-100)).toEqual(1);
  });
});

describe('transform(v, initialRange, targetRange)', () => {
  it('Tansforms value to targetRange', () => {
    const initial: Range = [0, 20];
    const target: Range = [0, 100];
    expect(transform(0, initial, target)).toEqual(0);
    expect(transform(5, initial, target)).toEqual(25);
    expect(transform(10, initial, target)).toEqual(50);
    expect(transform(15, initial, target)).toEqual(75);
    expect(transform(20, initial, target)).toEqual(100);
  });
});
