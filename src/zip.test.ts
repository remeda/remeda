import { zip } from './zip';
import { AssertEqual } from './_types';

const first = [1, 2, 3];
const second = ['a', 'b', 'c'];
const shorterFirst = [1, 2];
const shorterSecond = ['a', 'b'];

describe('data first', () => {
  test('should zip', () => {
    expect(zip(first, second)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  test('should truncate to shorter second', () => {
    expect(zip(first, shorterSecond)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  test('should truncate to shorter first', () => {
    expect(zip(shorterFirst, second)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data first typings', () => {
  test('arrays', () => {
    const actual = zip(first, second);
    const result: AssertEqual<typeof actual, [number, string][]> = true;
    expect(result).toBe(true);
  });
  test('tuples', () => {
    const actual = zip(first as [1, 2, 3], second as ['a', 'b', 'c']);
    const result: AssertEqual<
      typeof actual,
      [1 | 2 | 3, 'a' | 'b' | 'c'][]
    > = true;
    expect(result).toBe(true);
  });
  test('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zip(firstVariadic, secondVariadic);
    const result: AssertEqual<
      typeof actual,
      [string | number, string | number][]
    > = true;
    expect(result).toBe(true);
  });
});

describe('data second', () => {
  test('should zip', () => {
    expect(zip(second)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  test('should truncate to shorter second', () => {
    expect(zip(shorterSecond)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  test('should truncate to shorter first', () => {
    expect(zip(second)(shorterFirst)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data second typings', () => {
  test('arrays', () => {
    const actual = zip(second)(first);
    const result: AssertEqual<typeof actual, [number, string][]> = true;
    expect(result).toBe(true);
  });
  test('tuples', () => {
    const actual = zip(second as ['a', 'b', 'c'])(first as [1, 2, 3]);
    const result: AssertEqual<
      typeof actual,
      [1 | 2 | 3, 'a' | 'b' | 'c'][]
    > = true;
    expect(result).toBe(true);
  });
  test('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zip(secondVariadic)(firstVariadic);
    const result: AssertEqual<
      typeof actual,
      [string | number, string | number][]
    > = true;
    expect(result).toBe(true);
  });
});
