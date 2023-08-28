import { identity } from './identity';
import { intersectionMultiSetBy } from './intersectionMultiSetBy';
import { map } from './map';
import { pipe } from './pipe';
import { prop } from './prop';
import { take } from './take';

describe('runtime (identity)', () => {
  it('returns empty array trivially', () => {
    expect(intersectionMultiSetBy([], [], identity)).toEqual([]);
  });

  it('returns empty array on empty input', () => {
    expect(intersectionMultiSetBy([], [1, 2, 3], identity)).toEqual([]);
    expect(intersectionMultiSetBy([1, 2, 3], [], identity)).toEqual([]);
  });

  it('returns empty array on disjoint arrays', () => {
    expect(intersectionMultiSetBy([1], [2], identity)).toEqual([]);
  });

  it('works trivially on a single item', () => {
    expect(intersectionMultiSetBy([1], [1], identity)).toEqual([1]);
  });

  it('maintains multi-set semantics (returns only one copy)', () => {
    expect(intersectionMultiSetBy([1, 1], [1], identity)).toEqual([1]);
    expect(intersectionMultiSetBy([1], [1, 1], identity)).toEqual([1]);
  });

  it('maintains multi-set semantics (returns as many copies as available)', () => {
    expect(intersectionMultiSetBy([1, 1, 1, 1, 1], [1, 1], identity)).toEqual([
      1, 1,
    ]);
    expect(intersectionMultiSetBy([1, 1], [1, 1, 1, 1, 1], identity)).toEqual([
      1, 1,
    ]);
  });

  it('preserves the original order in source array', () => {
    expect(intersectionMultiSetBy([3, 2, 1], [1, 2, 3], identity)).toEqual([
      3, 2, 1,
    ]);
  });

  it('maintains order for multiple copies', () => {
    expect(
      intersectionMultiSetBy([3, 2, 2, 2, 2, 2, 1], [1, 2, 3], identity)
    ).toEqual([3, 2, 1]);
  });
});

describe('runtime (prop)', () => {
  it('returns empty array on empty input', () => {
    expect(
      intersectionMultiSetBy([], [{ id: 1 }, { id: 2 }, { id: 3 }], prop('id'))
    ).toEqual([]);
    expect(
      intersectionMultiSetBy([{ id: 1 }, { id: 2 }, { id: 3 }], [], prop('id'))
    ).toEqual([]);
  });

  it('returns empty array on disjoint arrays', () => {
    expect(
      intersectionMultiSetBy([{ id: 1 }], [{ id: 2 }], prop('id'))
    ).toEqual([]);
  });

  it('works trivially on a single item', () => {
    expect(
      intersectionMultiSetBy(
        [{ id: 1, subId: 1 }],
        [{ id: 1, subId: 2 }],
        prop('id')
      )
    ).toEqual([{ id: 1, subId: 1 }]);
  });

  it('maintains multi-set semantics (returns only one copy)', () => {
    expect(
      intersectionMultiSetBy(
        [
          { id: 1, subId: 1 },
          { id: 1, subId: 2 },
        ],
        [{ id: 1, subId: 3 }],
        prop('id')
      )
    ).toEqual([{ id: 1, subId: 1 }]);
    expect(
      intersectionMultiSetBy(
        [{ id: 1, subId: 1 }],
        [
          { id: 1, subId: 2 },
          { id: 1, subId: 3 },
        ],
        prop('id')
      )
    ).toEqual([{ id: 1, subId: 1 }]);
  });

  it('maintains multi-set semantics (returns as many copies as available)', () => {
    expect(
      intersectionMultiSetBy(
        [
          { id: 1, subId: 1 },
          { id: 1, subId: 2 },
          { id: 1, subId: 3 },
          { id: 1, subId: 4 },
          { id: 1, subId: 5 },
        ],
        [
          { id: 1, subId: 6 },
          { id: 1, subId: 7 },
        ],
        prop('id')
      )
    ).toEqual([
      { id: 1, subId: 1 },
      { id: 1, subId: 2 },
    ]);
    expect(
      intersectionMultiSetBy(
        [
          { id: 1, subId: 1 },
          { id: 1, subId: 2 },
        ],
        [
          { id: 1, subId: 3 },
          { id: 1, subId: 4 },
          { id: 1, subId: 5 },
          { id: 1, subId: 6 },
          { id: 1, subId: 7 },
        ],
        prop('id')
      )
    ).toEqual([
      { id: 1, subId: 1 },
      { id: 1, subId: 2 },
    ]);
  });

  it('preserves the original order in source array', () => {
    expect(
      intersectionMultiSetBy(
        [
          { id: 3, subId: 1 },
          { id: 2, subId: 1 },
          { id: 1, subId: 1 },
        ],
        [
          { id: 1, subId: 2 },
          { id: 2, subId: 2 },
          { id: 3, subId: 2 },
        ],
        prop('id')
      )
    ).toEqual([
      { id: 3, subId: 1 },
      { id: 2, subId: 1 },
      { id: 1, subId: 1 },
    ]);
  });

  it('maintains order for multiple copies', () => {
    expect(
      intersectionMultiSetBy(
        [
          { id: 3, subId: 0 },
          { id: 2, subId: 1 },
          { id: 2, subId: 2 },
          { id: 2, subId: 3 },
          { id: 2, subId: 4 },
          { id: 2, subId: 5 },
          { id: 1, subId: 6 },
        ],
        [
          { id: 1, subId: 7 },
          { id: 2, subId: 8 },
          { id: 3, subId: 9 },
        ],
        prop('id')
      )
    ).toEqual([
      { id: 3, subId: 0 },
      { id: 2, subId: 1 },
      { id: 1, subId: 6 },
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
      intersectionMultiSetBy([4, 2], identity),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([2, 4]);
  });
});

describe('typing', () => {
  it('trivially works with different item types', () => {
    expect(intersectionMultiSetBy([1, 2, 3], ['a', 'b'], identity)).toEqual([]);
  });

  it('provides scalar func the union of both types', () => {
    intersectionMultiSetBy([1, 2, 3], ['a', 'b'], x => {
      expectTypeOf(x).toEqualTypeOf<string | number>();
      return x;
    });
  });
});
