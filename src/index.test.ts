import { foo } from './index';

describe('foo', () => {
  it('should return prefixed v', () => {
    expect(foo({ v: 5 })).toEqual('foo-8');
  });
});
