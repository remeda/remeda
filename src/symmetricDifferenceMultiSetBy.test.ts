import { identity } from './identity';
import { prop } from './prop';
import { symmetricDifferenceMultiSetBy } from './symmetricDifferenceMultiSetBy';

describe('runtime (prop)', () => {
  test('empty arrays', () => {
    expect(symmetricDifferenceMultiSetBy([], [], prop('id'))).toEqual([]);
  });

  test('one empty array', () => {
    expect(
      symmetricDifferenceMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        [],
        prop('id')
      )
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    expect(
      symmetricDifferenceMultiSetBy(
        [],
        [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        prop('id')
      )
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });

  test('disjoint arrays', () => {
    expect(
      symmetricDifferenceMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 4 }, { id: 5 }, { id: 6 }],
        prop('id')
      )
    ).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ]);
  });

  test('equal arrays', () => {
    expect(
      symmetricDifferenceMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        prop('id')
      )
    ).toEqual([]);
  });

  test('intersecting arrays', () => {
    expect(
      symmetricDifferenceMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 2 }, { id: 3 }, { id: 4 }],
        prop('id')
      )
    ).toEqual([{ id: 1 }, { id: 4 }]);
  });

  test('multi-set semantics', () => {
    expect(
      symmetricDifferenceMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 2 }, { id: 3 }],
        [{ id: 2 }, { id: 3 }, { id: 3 }, { id: 4 }],
        prop('id')
      )
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });

  test('preserves order', () => {
    expect(
      symmetricDifferenceMultiSetBy(
        [
          { id: 10 },
          { id: 9 },
          { id: 8 },
          { id: 7 },
          { id: 6 },
          { id: 5 },
          { id: 4 },
        ],
        [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
        ],
        prop('id')
      )
    ).toEqual([
      { id: 10 },
      { id: 9 },
      { id: 8 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
    expect(
      symmetricDifferenceMultiSetBy(
        [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
        ],
        [
          { id: 10 },
          { id: 9 },
          { id: 8 },
          { id: 7 },
          { id: 6 },
          { id: 5 },
          { id: 4 },
        ],
        prop('id')
      )
    ).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 10 },
      { id: 9 },
      { id: 8 },
    ]);
  });
});

describe('typing', () => {
  it('trivially works with different item types', () => {
    expect(
      symmetricDifferenceMultiSetBy([1, 2, 3], ['a', 'b'], identity)
    ).toEqual([1, 2, 3, 'a', 'b']);
  });

  it('provides scalar func the union of both types', () => {
    symmetricDifferenceMultiSetBy([1, 2, 3], ['a', 'b'], x => {
      expectTypeOf(x).toEqualTypeOf<string | number>();
      return x;
    });
  });
});
