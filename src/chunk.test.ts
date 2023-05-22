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
  test('empty tuple', () => {
    const input: [] = [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test('readonly empty tuple', () => {
    const input = [] as const;
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test('array', () => {
    const input: Array<number> = [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
  });

  test('readonly array', () => {
    const input: ReadonlyArray<number> = [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
  });

  test('tuple', () => {
    const input: [number, number, number] = [123, 456, 789];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('readonly tuple', () => {
    const input: readonly [number, number, number] = [123, 456, 789];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('tuple with rest tail', () => {
    const input: [number, ...Array<number>] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('readonly tuple with rest tail', () => {
    const input: readonly [number, ...Array<number>] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('tuple with rest middle', () => {
    const input: [number, ...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('readonly tuple with rest middle', () => {
    const input: readonly [number, ...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('tuple with rest head', () => {
    const input: [...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test('readonly tuple with rest head', () => {
    const input: readonly [...Array<number>, number] = [123, 456];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });
});
