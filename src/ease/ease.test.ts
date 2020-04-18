import { ease } from './ease';

describe('ease', () => {
  it('Takes [0, 1] and returns [0, 1]', () => {
    Object.values(ease).forEach((easeFn) => {
      expect(easeFn(0)).toEqual(0);
      expect(easeFn(1)).toEqual(1);
    });
  });
});
