import { describe, test, expect } from 'vitest';
import { pickBy } from './pickBy';
import { pipe } from './pipe';
import { AssertEqual } from './_types';

describe('data first', () => {
  test('it should pick props', () => {
    const result = pickBy(
      { a: 1, b: 2, A: 3, B: 4 },
      (val, key) => key.toUpperCase() === key
    );
    const resultType: AssertEqual<
      typeof result,
      Record<'a' | 'b' | 'A' | 'B', number>
    > = true;
    expect(result).toStrictEqual({ A: 3, B: 4 });
    expect(resultType).toStrictEqual(true);
  });
  test('allow undefined or null', () => {
    expect(pickBy(undefined as any, (val, key) => key === 'foo')).toEqual({});
    expect(pickBy(null as any, (val, key) => key === 'foo')).toEqual({});
  });
  test('allow partial type', () => {
    const result = pickBy(
      {} as { a?: string; b?: number },
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
  test('it should pick props', () => {
    const result = pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      pickBy((val, key) => key.toUpperCase() === key)
    );
    const resultType: AssertEqual<
      typeof result,
      Record<'a' | 'b' | 'A' | 'B', number>
    > = true;
    expect(result).toStrictEqual({ A: 3, B: 4 });
    expect(resultType).toStrictEqual(true);
  });
  test('allow partial type', () => {
    const result = pipe(
      {} as { a?: string; b?: number },
      pickBy((val, key) => key.toUpperCase() === key)
    );
    const resultType: AssertEqual<
      typeof result,
      Partial<{ a: string; b: number }>
    > = true;
    expect(result).toEqual({});
    expect(resultType).toStrictEqual(true);
  });
});
