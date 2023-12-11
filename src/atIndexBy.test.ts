import { atIndexBy } from './atIndexBy';
import { identity } from './identity';
import { pipe } from './pipe';

describe('runtime (dataFirst)', () => {
  it('works', () => {
    const data = [2, 1, 3];
    expect(atIndexBy(data, 0, identity)).toEqual(1);
    expect(atIndexBy(data, 1, identity)).toEqual(2);
    expect(atIndexBy(data, 2, identity)).toEqual(3);
  });

  it('handles negative indexes', () => {
    const data = [2, 1, 3];
    expect(atIndexBy(data, -1, identity)).toEqual(3);
    expect(atIndexBy(data, -2, identity)).toEqual(2);
    expect(atIndexBy(data, -3, identity)).toEqual(1);
  });

  it('handles overflows gracefully', () => {
    expect(atIndexBy([1, 2, 3], 100, identity)).toBeUndefined();
    expect(atIndexBy([1, 2, 3], -100, identity)).toBeUndefined();
  });

  it('works with complex order rules', () => {
    const data = ['aaaa', 'b', 'bb', 'a', 'aaa', 'bbbb', 'aa', 'bbb'] as const;
    expect(atIndexBy(data, 0, a => a.length, identity)).toEqual('a');
    expect(atIndexBy(data, 1, a => a.length, identity)).toEqual('b');
    expect(atIndexBy(data, 2, a => a.length, identity)).toEqual('aa');
    expect(atIndexBy(data, 3, a => a.length, identity)).toEqual('bb');
    expect(atIndexBy(data, 4, a => a.length, identity)).toEqual('aaa');
    expect(atIndexBy(data, 5, a => a.length, identity)).toEqual('bbb');
    expect(atIndexBy(data, 6, a => a.length, identity)).toEqual('aaaa');
    expect(atIndexBy(data, 7, a => a.length, identity)).toEqual('bbbb');
  });
});

describe('runtime (dataLast)', () => {
  it('works', () => {
    const data = [2, 1, 3];
    expect(pipe(data, atIndexBy(0, identity))).toEqual(1);
    expect(pipe(data, atIndexBy(1, identity))).toEqual(2);
    expect(pipe(data, atIndexBy(2, identity))).toEqual(3);
  });

  it('handles negative indexes', () => {
    const data = [2, 1, 3];
    expect(pipe(data, atIndexBy(-1, identity))).toEqual(3);
    expect(pipe(data, atIndexBy(-2, identity))).toEqual(2);
    expect(pipe(data, atIndexBy(-3, identity))).toEqual(1);
  });

  it('handles overflows gracefully', () => {
    expect(pipe([1, 2, 3], atIndexBy(100, identity))).toBeUndefined();
    expect(pipe([1, 2, 3], atIndexBy(-100, identity))).toBeUndefined();
  });

  it('works with complex order rules', () => {
    const data = ['aaaa', 'b', 'bb', 'a', 'aaa', 'bbbb', 'aa', 'bbb'] as const;
    expect(
      pipe(
        data,
        atIndexBy(0, a => a.length, identity)
      )
    ).toEqual('a');
    expect(
      pipe(
        data,
        atIndexBy(1, a => a.length, identity)
      )
    ).toEqual('b');
    expect(
      pipe(
        data,
        atIndexBy(2, a => a.length, identity)
      )
    ).toEqual('aa');
    expect(
      pipe(
        data,
        atIndexBy(3, a => a.length, identity)
      )
    ).toEqual('bb');
    expect(
      pipe(
        data,
        atIndexBy(4, a => a.length, identity)
      )
    ).toEqual('aaa');
    expect(
      pipe(
        data,
        atIndexBy(5, a => a.length, identity)
      )
    ).toEqual('bbb');
    expect(
      pipe(
        data,
        atIndexBy(6, a => a.length, identity)
      )
    ).toEqual('aaaa');
    expect(
      pipe(
        data,
        atIndexBy(7, a => a.length, identity)
      )
    ).toEqual('bbbb');
  });
});
