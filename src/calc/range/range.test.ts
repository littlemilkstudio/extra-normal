import { clamp, progress, Range, transform } from './range';

describe('clamp(v, range)', () => {
  it('Clamps to upper bound', () => {
    const range: Range = [-50, 50];
    const inverseRange: Range = [50, -50];
    expect(clamp(100, range)).toEqual(range[1]);
    expect(clamp(100, inverseRange)).toEqual(inverseRange[0]);
  });

  it('Clamps to lower bound', () => {
    const range: Range = [-50, 50];
    const inverseRange: Range = [50, -50];
    expect(clamp(-100, range)).toEqual(range[0]);
    expect(clamp(-100, inverseRange)).toEqual(inverseRange[1]);
  });
});

describe('progress(v, range)', () => {
  it('Calculates progress in standard range', () => {
    const standard: Range = [0, 100];
    expect(progress(0, standard)).toEqual(0);
    expect(progress(25, standard)).toEqual(0.25);
    expect(progress(50, standard)).toEqual(0.5);
    expect(progress(75, standard)).toEqual(0.75);
    expect(progress(100, standard)).toEqual(1);
  });

  it('Calculates progress in inverse range', () => {
    const inverse: Range = [100, 0];
    expect(progress(100, inverse)).toEqual(0);
    expect(progress(75, inverse)).toEqual(0.25);
    expect(progress(50, inverse)).toEqual(0.5);
    expect(progress(25, inverse)).toEqual(0.75);
    expect(progress(0, inverse)).toEqual(1);
  });

  it('Calculates progress in negative range', () => {
    const negative: Range = [-100, 0];
    expect(progress(-100, negative)).toEqual(0);
    expect(progress(-75, negative)).toEqual(0.25);
    expect(progress(-50, negative)).toEqual(0.5);
    expect(progress(-25, negative)).toEqual(0.75);
    expect(progress(0, negative)).toEqual(1);
  });

  it('Calculates progress in negative inverse range', () => {
    const negativeInverse: Range = [0, -100];
    expect(progress(0, negativeInverse)).toEqual(0);
    expect(progress(-25, negativeInverse)).toEqual(0.25);
    expect(progress(-50, negativeInverse)).toEqual(0.5);
    expect(progress(-75, negativeInverse)).toEqual(0.75);
    expect(progress(-100, negativeInverse)).toEqual(1);
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
