import { identity } from './identity';
import { prop } from './prop';
import { unionMultisetBy } from './unionMultisetBy';

describe('runtime (identity)', () => {
  it('returns trivial on empty inputs', () => {
    expect(unionMultisetBy([], [], identity)).toEqual([]);
  });

  it('returns the other on empty input', () => {
    const other = [1, 2, 3];
    expect(unionMultisetBy([], other, identity)).toEqual(other);
  });

  it('return data on empty other', () => {
    const data = [1, 2, 3];
    expect(unionMultisetBy(data, [], identity)).toEqual(data);
  });

  it('performs simple concat on disjoint arrays', () => {
    expect(unionMultisetBy([1], [2], identity)).toEqual([1, 2]);
  });

  it('Returns trivially if other is contained in data', () => {
    expect(unionMultisetBy([1, 2, 3], [1], identity)).toEqual([1, 2, 3]);
  });

  it('dedups items in other', () => {
    expect(unionMultisetBy([1, 1, 1, 1, 2], [1, 1, 1, 3], identity)).toEqual([
      1, 1, 1, 1, 2, 3,
    ]);
  });

  it('Maintains order from data', () => {
    expect(unionMultisetBy([3, 2, 1], [1, 2, 3], identity)).toEqual([3, 2, 1]);
  });

  it('maintains order of unique items in other', () => {
    expect(unionMultisetBy([1, 2, 3], [6, 5, 4, 3, 2, 1], identity)).toEqual([
      1, 2, 3, 6, 5, 4,
    ]);
  });
});

describe('runtime (extract prop)', () => {
  it('returns trivial on empty inputs', () => {
    expect(unionMultisetBy([], [], prop('id'))).toEqual([]);
  });

  it('returns the other on empty input', () => {
    const other = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(unionMultisetBy([], other, prop('id'))).toEqual(other);
  });

  it('return data on empty other', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(unionMultisetBy(data, [], prop('id'))).toEqual(data);
  });

  it('performs simple concat on disjoint arrays', () => {
    expect(unionMultisetBy([{ id: 1 }], [{ id: 2 }], prop('id'))).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it('Returns trivially if other is contained in data', () => {
    expect(
      unionMultisetBy(
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        [{ id: 1 }],
        prop('id')
      )
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('dedups items in other', () => {
    expect(
      unionMultisetBy(
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
      unionMultisetBy(
        [{ id: 3 }, { id: 2 }, { id: 1 }],
        [{ id: 1 }, { id: 2 }, { id: 3 }],
        prop('id')
      )
    ).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
  });

  it('maintains order of unique items in other', () => {
    expect(
      unionMultisetBy(
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
    expect(unionMultisetBy([1, 2, 3], ['a', 'b'], identity)).toEqual([
      1,
      2,
      3,
      'a',
      'b',
    ]);
  });

  it('provides scalar func the union of both types', () => {
    unionMultisetBy([1, 2, 3], ['a', 'b'], x => {
      expectTypeOf(x).toEqualTypeOf<string | number>();
      return x;
    });
  });
});
