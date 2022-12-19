import { findLast } from './findLast';
import { pipe } from './pipe';

const array = [1, 2, 3, 4];

describe('data first', () => {
  test('findLast', () => {
    expect(findLast(array, x => x % 2 === 1)).toEqual(3);
  });
  test('findLast.indexed', () => {
    expect(findLast.indexed(array, (x, i) => x === 3 && i === 2)).toEqual(3);
  });
  test('findLast first value', () => {
    expect(findLast(array, x => x === 1)).toEqual(1);
  })
  test('findLast no match', () => {
    expect(findLast(array, x => x === 5)).toBeUndefined();
  })
});

describe('data last', () => {
  test('findLast', () => {
    const actual = pipe([1, 2, 3, 4], findLast(x => x % 2 === 1));
    expect(actual).toEqual(3);
  });

  test('findLast.indexed', () => {
    const actual = pipe([1, 2, 3, 4], findLast.indexed((x, i) => x === 3 && i === 2));
    expect(actual).toEqual(3);
  });
});
