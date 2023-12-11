import { firstIndexBy } from './firstIndexBy';
import { identity } from './identity';

describe('runtime', () => {
  it('returns -1 when empty', () => {
    expect(firstIndexBy([], identity)).toBe(-1);
  });

  it('works with a single-item array', () => {
    expect(firstIndexBy([1], identity)).toBe(0);
  });

  it('finds the index of the minimum', () => {
    expect(firstIndexBy([2, 1, 4, 3, 5], identity)).toBe(1);
  });

  it('finds the index of the minimum with a non-trivial order rule', () => {
    expect(
      firstIndexBy(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], x => x.length)
    ).toBe(1);
  });

  it("finds the index of the max with 'desc' order rules", () => {
    expect(firstIndexBy([2, 1, 4, 3, 5], [identity, 'desc'])).toBe(4);
  });

  it("finds the max with non-trivial 'desc' order rules", () => {
    expect(
      firstIndexBy(['aa', 'a', 'aaaa', 'aaa', 'aaaaa'], [identity, 'desc'])
    ).toBe(4);
  });

  it('breaks ties with multiple order rules', () => {
    const data = ['a', 'bb', 'b', 'aaaa', 'bbb', 'aa', 'aaa', 'bbbb'];
    expect(firstIndexBy(data, x => x.length, identity)).toBe(0);
    expect(firstIndexBy(data, [x => x.length, 'desc'], identity)).toBe(3);
    expect(firstIndexBy(data, x => x.length, [identity, 'desc'])).toBe(2);
    expect(
      firstIndexBy(data, [x => x.length, 'desc'], [identity, 'desc'])
    ).toBe(7);
  });

  it('can compare strings', () => {
    expect(firstIndexBy(['b', 'a', 'c'], identity)).toBe(1);
  });

  it('can compare numbers', () => {
    expect(firstIndexBy([2, 1, 3], identity)).toBe(1);
  });

  it('can compare booleans', () => {
    expect(firstIndexBy([true, false, false, true, false], identity)).toBe(1);
  });

  it('can compare valueOfs', () => {
    expect(
      firstIndexBy([new Date(), new Date(1), new Date(2)], identity)
    ).toEqual(1);
  });
});
