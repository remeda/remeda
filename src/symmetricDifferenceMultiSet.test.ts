import { symmetricDifferenceMultiSet } from './symmetricDifferenceMultiSet';

describe('runtime', () => {
  test('empty arrays', () => {
    expect(symmetricDifferenceMultiSet([], [])).toEqual([]);
  });

  test('1 empty array', () => {
    expect(symmetricDifferenceMultiSet([1, 2, 3, 4], [])).toEqual([1, 2, 3, 4]);
    expect(symmetricDifferenceMultiSet([], [1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  test('disjoint arrays', () => {
    expect(symmetricDifferenceMultiSet([1, 2, 3], [4, 5, 6])).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
  });

  test('equal arrays', () => {
    expect(symmetricDifferenceMultiSet([1, 2, 3], [1, 2, 3])).toEqual([]);
  });

  test('intersecting arrays', () => {
    expect(symmetricDifferenceMultiSet([1, 2, 3], [2, 3, 4])).toEqual([1, 4]);
  });

  test('multi-set semantics', () => {
    expect(symmetricDifferenceMultiSet([1, 2, 2, 3], [2, 3, 3, 4])).toEqual([
      1, 2, 3, 4,
    ]);
  });

  test('preserves order', () => {
    expect(
      symmetricDifferenceMultiSet([10, 9, 8, 7, 6, 5, 4], [1, 2, 3, 4, 5, 6, 7])
    ).toEqual([10, 9, 8, 1, 2, 3]);
    expect(
      symmetricDifferenceMultiSet([1, 2, 3, 4, 5, 6, 7], [10, 9, 8, 7, 6, 5, 4])
    ).toEqual([1, 2, 3, 10, 9, 8]);
  });
});
