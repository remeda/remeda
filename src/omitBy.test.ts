import { describe, test, expect } from 'vitest';
import { omitBy } from './omitBy';
import { pipe } from './pipe';
import { AssertEqual } from './_types';

describe('data first', () => {
  test('it should omit props', () => {
    const result = omitBy(
      { a: 1, b: 2, A: 3, B: 4 },
      (val, key) => key.toUpperCase() === key
    );
    const resultType: AssertEqual<
      typeof result,
      Record<'a' | 'b' | 'A' | 'B', number>
    > = true;
    expect(result).toStrictEqual({ a: 1, b: 2 });
    expect(resultType).toStrictEqual(true);
  });
  test('allow partial type', () => {
    const result = omitBy(
      {} as Partial<{ a: string; b: number }>,
      (val, key) => key === 'a'
    );
    const resultType: AssertEqual<
      typeof result,
      Partial<{ a: string; b: number }>
    > = true;
    expect(result).toEqual({});
    expect(resultType).toStrictEqual(true);
  });
});

describe('data last', () => {
  test('it should omit props', () => {
    const result = pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      omitBy((val, key) => key.toUpperCase() === key)
    );
    const resultType: AssertEqual<
      typeof result,
      Record<'a' | 'b' | 'A' | 'B', number>
    > = true;
    expect(result).toStrictEqual({ a: 1, b: 2 });
    expect(resultType).toStrictEqual(true);
  });
  test('allow partial type', () => {
    const result = pipe(
      {} as Partial<{ a: string; b: number }>,
      omitBy((val, key) => key.toUpperCase() === key)
    );
    const resultType: AssertEqual<
      typeof result,
      Partial<{ a: string; b: number }>
    > = true;
    expect(result).toEqual({});
    expect(resultType).toStrictEqual(true);
  });
});
