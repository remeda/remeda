import { findLastIndex } from './findLastIndex';
import { pipe } from './pipe';

const array = [1, 2, 3, 4];

describe('data first', () => {
  test('findLastIndex', () => {
    expect(findLastIndex(array, x => x % 2 === 1)).toBe(2);
  });

  test('findLastIndex.indexed', () => {
    expect(findLastIndex.indexed(array, (x, _i) => x % 2 === 1)).toBe(2);
  });

  test('findLast first value', () => {
    expect(findLastIndex(array, x => x === 1)).toEqual(0);
  });

  test('findLastIndex -1', () => {
    expect(findLastIndex(array, x => x === 5)).toBe(-1);
  });
});

describe('data last', () => {
  test('findLastIndex', () => {
    expect(
      pipe(
        array,
        findLastIndex(x => x % 2 === 1)
      )
    ).toEqual(2);
  });

  test('findLastIndex.indexed', () => {
    expect(
      pipe(
        array,
        findLastIndex.indexed(x => x % 2 === 1)
      )
    ).toEqual(2);
  });
});
