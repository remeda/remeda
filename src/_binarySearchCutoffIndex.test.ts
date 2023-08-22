import { _binarySearchCutoffIndex } from './_binarySearchCutoffIndex';

describe('runtime correctness', () => {
  test('empty array', () => {
    expect(_binarySearchCutoffIndex([], () => true)).toBe(0);
  });

  test('single value, always false', () => {
    expect(_binarySearchCutoffIndex([1], () => false)).toBe(0);
  });

  test('single value, always true', () => {
    expect(_binarySearchCutoffIndex([1], () => true)).toBe(1);
  });

  test('multiple values, always false', () => {
    expect(_binarySearchCutoffIndex([1, 2, 3, 4, 5], () => false)).toBe(0);
  });

  test('multiple values, always true', () => {
    expect(_binarySearchCutoffIndex([1, 2, 3, 4, 5], () => true)).toBe(5);
  });

  test('fancy stuff', () => {
    expect(
      _binarySearchCutoffIndex(
        ['a', 'ab', 'abc', 'abcd', 'abcde'],
        ({ length }) => length < 3
      )
    ).toBe(2);
  });
});

describe('binary search correctness via the index', () => {
  test('after 0 items', () => {
    expect(
      indicesSeen(
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        (_, index) => index < 0
      )
    ).toEqual([8, 4, 2, 1, 0]);
  });

  test('after 4 items', () => {
    expect(
      indicesSeen(
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        (_, index) => index < 4
      )
    ).toEqual([8, 4, 2, 3]);
  });

  test('after 8 items', () => {
    expect(
      indicesSeen(
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        (_, index) => index < 8
      )
    ).toEqual([8, 4, 6, 7]);
  });

  test('after 12 items', () => {
    expect(
      indicesSeen(
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        (_, index) => index < 12
      )
    ).toEqual([8, 12, 10, 11]);
  });

  test('after 20 items', () => {
    expect(
      indicesSeen(
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        (_, index) => index < 20
      )
    ).toEqual([8, 12, 14, 15]);
  });
});

function indicesSeen(
  items: ReadonlyArray<unknown>,
  predicate: (item: unknown, index: number) => boolean
): ReadonlyArray<number> {
  const indicesSeen: Array<number> = [];
  _binarySearchCutoffIndex(items, (pivot, index) => {
    indicesSeen.push(index);
    return predicate(pivot, index);
  });
  return indicesSeen;
}
