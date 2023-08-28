import { identity } from './identity';
import { prop } from './prop';
import { unionMultiSetBy } from './unionMultiSetBy';

describe('runtime (identity)', () => {
  it('returns trivial on empty inputs', () => {
    expect(unionMultiSetBy([], [], identity)).toEqual([]);
  });

  it('returns the other on empty input', () => {
    const other = [1, 2, 3];
    expect(unionMultiSetBy([], other, identity)).toEqual(other);
  });

  it('return data on empty other', () => {
    const data = [1, 2, 3];
    expect(unionMultiSetBy(data, [], identity)).toEqual(data);
  });

  it('performs simple concat on disjoint arrays', () => {
    expect(unionMultiSetBy([1], [2], identity)).toEqual([1, 2]);
  });

  it('Returns trivially if other is contained in data', () => {
    expect(unionMultiSetBy([1, 2, 3], [1], identity)).toEqual([1, 2, 3]);
  });

  it('dedups items in other', () => {
    expect(unionMultiSetBy([1, 1, 1, 1, 2], [1, 1, 1, 3], identity)).toEqual([
      1, 1, 1, 1, 2, 3,
    ]);
  });

  it('Maintains order from data', () => {
    expect(unionMultiSetBy([3, 2, 1], [1, 2, 3], identity)).toEqual([3, 2, 1]);
  });

  it('maintains order of unique items in other', () => {
    expect(unionMultiSetBy([1, 2, 3], [6, 5, 4, 3, 2, 1], identity)).toEqual([
      1, 2, 3, 6, 5, 4,
    ]);
  });
});

describe('runtime (extract prop)', () => {
  it('returns trivial on empty inputs', () => {
    expect(unionMultiSetBy([], [], prop('id'))).toEqual([]);
  });

  it('returns the other on empty input', () => {
    const other = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(unionMultiSetBy([], other, prop('id'))).toEqual(other);
  });

  it('return data on empty other', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(unionMultiSetBy(data, [], prop('id'))).toEqual(data);
  });

  it('performs simple concat on disjoint arrays', () => {
    expect(unionMultiSetBy([{ id: 1 }], [{ id: 2 }], prop('id'))).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it('Returns trivially if other is contained in data', () => {
    expect(
      unionMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 1 }],
        prop('id')
      )
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('dedups items in other', () => {
    expect(
      unionMultiSetBy(
        [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }, { id: 2 }],
        [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 3 }],
        prop('id')
      )
    ).toEqual([
      { id: 1 },
      { id: 1 },
      { id: 1 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it('Maintains order from data', () => {
    expect(
      unionMultiSetBy(
        [{ id: 3 }, { id: 2 }, { id: 1 }],
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        prop('id')
      )
    ).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
  });

  it('maintains order of unique items in other', () => {
    expect(
      unionMultiSetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 6 }, { id: 5 }, { id: 4 }, { id: 3 }, { id: 2 }, { id: 1 }],
        prop('id')
      )
    ).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 6 },
      { id: 5 },
      { id: 4 },
    ]);
  });
});

describe('typing', () => {
  it('trivially works with different item types', () => {
    expect(unionMultiSetBy([1, 2, 3], ['a', 'b'], identity)).toEqual([
      1,
      2,
      3,
      'a',
      'b',
    ]);
  });

  it('provides scalar func the union of both types', () => {
    unionMultiSetBy([1, 2, 3], ['a', 'b'], x => {
      expectTypeOf(x).toEqualTypeOf<string | number>();
      return x;
    });
  });
});
