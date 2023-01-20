import { zipObj } from './zipObj';

const expectType = <E>(result: E) => result;

describe('data first', () => {
  test('equal lengths', () => {
    const result = zipObj(['a', 'b'], [1, 2]);

    expectType<Record<string, number>>(result);

    expect(result).toEqual({
      a: 1,
      b: 2,
    });
  });
  test('more keys', () => {
    expect(zipObj(['a', 'b', 'c'], [1, 2])).toEqual({
      a: 1,
      b: 2,
      c: undefined,
    });
  });
  test('more values', () => {
    expect(() => zipObj(['a', 'b'], [1, 2, 2])).toThrow(
      'Number of values exceeds number of keys (2 keys, 3 values)'
    );
  });
});

describe('data last', () => {
  test('equal lengths', () => {
    const partial = zipObj([1, 2]);

    expectType<(keys: any[]) => Record<any, number>>(partial);

    expect(partial(['a', 'b'])).toEqual({
      a: 1,
      b: 2,
    });
  });
});
