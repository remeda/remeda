import { pickBy } from './pickBy';
import { pipe } from './pipe';

describe('data first', () => {
  test('it should pick props', () => {
    const result = pickBy(
      { a: 1, b: 2, A: 3, B: 4 },
      (_, key) => key.toUpperCase() === key
    );
    assertType<Record<'a' | 'b' | 'A' | 'B', number>>(result);
    expect(result).toStrictEqual({ A: 3, B: 4 });
  });
  test('allow undefined or null', () => {
    expect(pickBy(undefined as any, (_, key) => key === 'foo')).toEqual({});
    expect(pickBy(null as any, (_, key) => key === 'foo')).toEqual({});
  });
  test('allow partial type', () => {
    const result = pickBy(
      {} as { a?: string; b?: number },
      (_, key) => key === 'a'
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});

describe('data last', () => {
  test('it should pick props', () => {
    const result = pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      pickBy((_, key) => key.toUpperCase() === key)
    );
    assertType<Record<'a' | 'b' | 'A' | 'B', number>>(result);
    expect(result).toStrictEqual({ A: 3, B: 4 });
  });
  test('allow partial type', () => {
    const result = pipe(
      {} as { a?: string; b?: number },
      pickBy((_, key) => key.toUpperCase() === key)
    );
    assertType<Partial<{ a: string; b: number }>>(result);
    expect(result).toEqual({});
  });
});
