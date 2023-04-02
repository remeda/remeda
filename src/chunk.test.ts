import { chunk } from './chunk';
import { NonEmptyArray } from './_types';

describe('data first', () => {
  test('equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  test('not equal size', () => {
    expect(chunk(['a', 'b', 'c', 'd'] as const, 3)).toEqual([
      ['a', 'b', 'c'],
      ['d'],
    ]);
  });

  test('1 element', () => {
    expect(chunk(['x'] as const, 3)).toEqual([['x']]);
  });

  test('empty array', () => {
    expect(chunk([] as const, 3)).toEqual([]);
  });
});

describe('data last', () => {
  test('equal size', () => {
    expect(chunk(2)(['a', 'b', 'c', 'd'] as const)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });
});

describe('strict typing', () => {
  test('array', () => {
    const input: Array<number> = [];
    const result = chunk(input, 2);
    const [first, ...rest] = result;
    expectTypeOf(result).toEqualTypeOf<
      [] | NonEmptyArray<NonEmptyArray<number>>
    >();
    expectTypeOf(first).toEqualTypeOf<NonEmptyArray<number> | undefined>();
    expectTypeOf(rest).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    expect(result).toEqual([]);
  });

  test('non empty start array', () => {
    const input: [number, ...Array<number>] = [1];
    const result = chunk(input, 2);
    const [first, ...rest] = result;
    const [firstValue, ...otherValues] = first;
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
    expectTypeOf(first).toEqualTypeOf<NonEmptyArray<number>>();
    expectTypeOf(rest).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    expectTypeOf(firstValue).toEqualTypeOf<number>();
    expectTypeOf(otherValues).toEqualTypeOf<Array<number>>();
    expect(result).toEqual([[1]]);
  });

  test('non empty end array', () => {
    const input: [...Array<number>, number] = [1];
    const result = chunk(input, 2);
    const [first, ...rest] = result;
    const [firstValue, ...otherValues] = first;
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
    expectTypeOf(first).toEqualTypeOf<NonEmptyArray<number>>();
    expectTypeOf(rest).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    expectTypeOf(firstValue).toEqualTypeOf<number>();
    expectTypeOf(otherValues).toEqualTypeOf<Array<number>>();
    expect(result).toEqual([[1]]);
  });
});
