import { foo } from './foo';

describe('foo', () => {
  it('should return prefixed v', () => {
    expect(foo({ v: 5 })).toEqual('foo-5');
  });
});
