import { intersectionMultiSet } from './intersectionMultiSet';
import { map } from './map';
import { pipe } from './pipe';
import { take } from './take';

describe('runtime', () => {
  it('returns empty array trivially', () => {
    expect(intersectionMultiSet([], [])).toEqual([]);
  });

  it('returns empty array on empty input', () => {
    expect(intersectionMultiSet([], [1, 2, 3])).toEqual([]);
    expect(intersectionMultiSet([1, 2, 3], [])).toEqual([]);
  });

  it('returns empty array on disjoint arrays', () => {
    expect(intersectionMultiSet([1], [2])).toEqual([]);
  });

  it('works trivially on a single item', () => {
    expect(intersectionMultiSet([1], [1])).toEqual([1]);
  });

  it('maintains multi-set semantics (returns only one copy)', () => {
    expect(intersectionMultiSet([1, 1], [1])).toEqual([1]);
    expect(intersectionMultiSet([1], [1, 1])).toEqual([1]);
  });

  it('maintains multi-set semantics (returns as many copies as available)', () => {
    expect(intersectionMultiSet([1, 1, 1, 1, 1], [1, 1])).toEqual([1, 1]);
    expect(intersectionMultiSet([1, 1], [1, 1, 1, 1, 1])).toEqual([1, 1]);
  });

  it('preserves the original order in source array', () => {
    expect(intersectionMultiSet([3, 2, 1], [1, 2, 3])).toEqual([3, 2, 1]);
  });

  it('maintains order for multiple copies', () => {
    expect(intersectionMultiSet([3, 2, 2, 2, 2, 2, 1], [1, 2, 3])).toEqual([
      3, 2, 1,
    ]);
  });
});

describe('piping', () => {
  test('lazy', () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map(x => {
        count();
        return x;
      }),
      intersectionMultiSet([4, 2]),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([2, 4]);
  });
});

describe('typing', () => {
  it('narrows the result type', () => {
    expectTypeOf(
      intersectionMultiSet([1, 2, 3, 'a', 'b'], ['a', 'b', true, false])
    ).toEqualTypeOf<Array<string>>();
  });
});
