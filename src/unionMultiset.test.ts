import { unionMultiset } from './unionMultiset';

describe('runtime', () => {
  it('returns trivial on empty inputs', () => {
    expect(unionMultiset([], [])).toEqual([]);
  });

  it('returns the other on empty input', () => {
    const other = [1, 2, 3];
    expect(unionMultiset([], other)).toEqual(other);
  });

  it('return data on empty other', () => {
    const data = [1, 2, 3];
    expect(unionMultiset(data, [])).toEqual(data);
  });

  it('performs simple concat on disjoint arrays', () => {
    expect(unionMultiset([1], [2])).toEqual([1, 2]);
  });

  it('Returns trivially if other is contained in data', () => {
    expect(unionMultiset([1, 2, 3], [1])).toEqual([1, 2, 3]);
  });

  it('dedups items in other', () => {
    expect(unionMultiset([1, 1, 1, 1, 2], [1, 1, 1, 3])).toEqual([
      1, 1, 1, 1, 2, 3,
    ]);
  });

  it('Maintains order from data', () => {
    expect(unionMultiset([3, 2, 1], [1, 2, 3])).toEqual([3, 2, 1]);
  });

  it('maintains order of unique items in other', () => {
    expect(unionMultiset([1, 2, 3], [6, 5, 4, 3, 2, 1])).toEqual([
      1, 2, 3, 6, 5, 4,
    ]);
  });
});

describe('typing', () => {
  it('trivially works with different item types', () => {
    expect(unionMultiset([1, 2, 3], ['a', 'b'])).toEqual([1, 2, 3, 'a', 'b']);
  });
});
