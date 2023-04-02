import { zipObj } from './zipObj';
import { expectTypeOf } from 'vitest';

const first = ['a', 'b', 'c'];
const second = [1, 2, 3];
const shorterSecond = [1, 2];
const shorterFirst = ['a', 'b'];

describe('data first', () => {
  test('should zipObj', () => {
    expect(zipObj(first, second)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
  test('should truncate to shorter second', () => {
    expect(zipObj(first, shorterSecond)).toEqual({
      a: 1,
      b: 2,
    });
  });
  test('should truncate to shorter first', () => {
    expect(zipObj(shorterFirst, second)).toEqual({
      a: 1,
      b: 2,
    });
  });
});

describe('data first typings', () => {
  test('arrays', () => {
    const actual = zipObj(first, second);
    expectTypeOf(actual).toEqualTypeOf<Record<string, number>>();
  });
  test('tuples', () => {
    const actual = zipObj(first as ['a', 'b', 'c'], second as [1, 2, 3]);
    expectTypeOf(actual).toEqualTypeOf<Record<'a' | 'b' | 'c', 1 | 2 | 3>>();
  });
  test('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zipObj(firstVariadic, secondVariadic);
    expectTypeOf(actual).toEqualTypeOf<
      Record<string | number, number | string>
    >();
  });
});

describe('data second', () => {
  test('should zip', () => {
    expect(zipObj(second)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
  test('should truncate to shorter second', () => {
    expect(zipObj(shorterSecond)(first)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
  test('should truncate to shorter first', () => {
    expect(zipObj(second)(shorterFirst)).toEqual([
      [1, 'a'],
      [2, 'b'],
    ]);
  });
});

describe('data last typings', () => {
  test('arrays', () => {
    const actual = zipObj(second)(first);
    expectTypeOf(actual).toEqualTypeOf<Record<string, number>>();
  });
  test('tuples', () => {
    const actual = zipObj(second as [1, 2, 3])(first as ['a', 'b', 'c']);
    expectTypeOf(actual).toEqualTypeOf<Record<'a' | 'b' | 'c', 1 | 2 | 3>>();
  });
  test('variadic tuples', () => {
    const firstVariadic: [number, ...Array<string>] = [1, 'b', 'c'];
    const secondVariadic: [string, ...Array<number>] = ['a', 2, 3];
    const actual = zipObj(secondVariadic)(firstVariadic);
    expectTypeOf(actual).toEqualTypeOf<
      Record<string | number, string | number>
    >();
  });
});
