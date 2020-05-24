import { start, push, pull, stop, Callbag } from './callbag';

describe('start(talkback)', () => {
  it('returns a start identifiable signal', () => {
    const talkback = (() => null) as Callbag;
    expect(start(talkback).isStart).toBe(true);
  });
});

describe('createPush(value)', () => {
  it('returns a push identifiable signal', () => {
    expect(push(5).isPush).toBe(true);
  });
});

describe('pull()', () => {
  it('returns a pull identifiable signal', () => {
    expect(pull().isPull).toBe(true);
  });
});

describe('stop()', () => {
  it('returns a stop identifiable signal', () => {
    expect(stop().isStop).toBe(true);
  });
});
