import { AssertEqual } from './_types';
import { reverse } from './reverse';
import { pipe } from './pipe';

describe('data first', () => {
  test('reverse', () => {
    const actual = reverse([1, 2, 3]);
    expect(actual).toEqual([3, 2, 1]);
  });
  describe('reverse typings', () => {
    test('arrays', () => {
      const actual = reverse([1, 2, 3]);
      const result: AssertEqual<typeof actual, number[]> = true;
      expect(result).toEqual(true);
    });
    test('tuples', () => {
      const actual = reverse([1, 2, 3] as const);
      const result: AssertEqual<typeof actual, [3, 2, 1]> = true;
      expect(result).toEqual(true);
    });
  });
});

describe('data last', () => {
  test('reverse', () => {
    const actual = pipe([1, 2, 3], reverse());
    expect(actual).toEqual([3, 2, 1]);
  });
  describe('reverse typings', () => {
    test('arrays', () => {
      const actual = pipe([1, 2, 3], reverse());
      const result: AssertEqual<typeof actual, number[]> = true;
      expect(result).toEqual(true);
    });
    test('tuples', () => {
      const actual = pipe([1, 2, 3] as const, reverse());
      const result: AssertEqual<typeof actual, [3, 2, 1]> = true;
      expect(result).toEqual(true);
    });
  });
});
