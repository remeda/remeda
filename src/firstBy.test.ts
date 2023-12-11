import { NonEmptyArray } from './_types';
import { firstBy } from './firstBy';
import { identity } from './identity';

describe('runtime', () => {
  it('returns undefined on empty', () => {
    expect(firstBy([], identity)).toBeUndefined();
  });

  it('returns the item on a single item array', () => {
    expect(firstBy([1], identity)).toBe(1);
  });

  it('finds the minimum', () => {
    expect(firstBy([2, 1, 4, 3, 5], identity)).toBe(1);
  });

  it('finds the minimum with a non-trivial order rule', () => {
    expect(firstBy(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], x => x.length)).toBe(
      'a'
    );
  });

  it("finds the max with 'desc' order rules", () => {
    expect(firstBy([2, 1, 4, 3, 5], [identity, 'desc'])).toBe(5);
  });

  it("finds the max with non-trivial 'desc' order rules", () => {
    expect(
      firstBy(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], [identity, 'desc'])
    ).toBe('aaaaa');
  });

  it('breaks ties with multiple order rules', () => {
    const data = ['a', 'bb', 'b', 'aaaa', 'bbb', 'aa', 'aaa', 'bbbb'];
    expect(firstBy(data, x => x.length, identity)).toBe('a');
    expect(firstBy(data, [x => x.length, 'desc'], identity)).toBe('aaaa');
    expect(firstBy(data, x => x.length, [identity, 'desc'])).toBe('b');
    expect(firstBy(data, [x => x.length, 'desc'], [identity, 'desc'])).toBe(
      'bbbb'
    );
  });

  it('can compare strings', () => {
    expect(firstBy(['b', 'a', 'c'], identity)).toBe('a');
  });

  it('can compare numbers', () => {
    expect(firstBy([2, 1, 3], identity)).toBe(1);
  });

  it('can compare booleans', () => {
    expect(firstBy([true, false, true, true, false], identity)).toBe(false);
  });

  it('can compare valueOfs', () => {
    expect(firstBy([new Date(), new Date(1), new Date(2)], identity)).toEqual(
      new Date(1)
    );
  });
});

describe('typing', () => {
  it('can return undefined on arrays', () => {
    const data: ReadonlyArray<number> = [1, 2, 3];
    const result = firstBy(data, identity);
    expectTypeOf(result).toBeNullable();
  });

  it("can't return undefined on non-empty array", () => {
    const data: NonEmptyArray<number> = [1, 2, 3];
    const result = firstBy(data, identity);
    expectTypeOf(result).not.toBeNullable();
  });

  it('only returns null on the empty array', () => {
    const data = [] as const;
    const result = firstBy(data, identity);
    expectTypeOf(result).toBeUndefined();
  });
});
