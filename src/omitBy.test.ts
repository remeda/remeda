import { omitBy } from './omitBy';
import { pipe } from './pipe';

describe('data first', () => {
  test('it should omit props', () => {
    const result = omitBy(
      { a: 1, b: 2, A: 3, B: 4 },
      (_, key) => key.toUpperCase() === key
    );
    assertType<Record<'a' | 'b' | 'A' | 'B', number>>(result);
    expect(result).toStrictEqual({ a: 1, b: 2 });
  });
  test('allow partial type', () => {
    const result = omitBy(
      {} as Partial<{ a: string; b: number }>,
      (_, key) => key === 'a'
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});

describe('data last', () => {
  test('it should omit props', () => {
    const result = pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      omitBy((_, key) => key.toUpperCase() === key)
    );
    assertType<Record<'a' | 'b' | 'A' | 'B', number>>(result);
    expect(result).toStrictEqual({ a: 1, b: 2 });
  });
  test('allow partial type', () => {
    const result = pipe(
      {} as Partial<{ a: string; b: number }>,
      omitBy((_, key) => key.toUpperCase() === key)
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});
