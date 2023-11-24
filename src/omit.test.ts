import { omit } from './omit';
import { pipe } from './pipe';

describe('data first', () => {
  test('omit', () => {
    const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd'] as const);
    expect(result).toEqual({ b: 2, c: 3 });
  });

  test('single removed prop works', () => {
    const obj: { a: number } = { a: 1 };
    const result = omit(obj, ['a']);
    expect(result).toEqual({});
  });

  test('non existing prop', () => {
    // @ts-expect-error -- should not allow non existing props
    const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['not', 'in'] as const);
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});

describe('data last', () => {
  test('omit', () => {
    const result = pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      omit(['a', 'd', 'a'] as const)
    );
    expect(result).toEqual({ b: 2, c: 3 });
  });

  test('non existing prop', () => {
    const result = pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      // @ts-expect-error -- should not allow non existing props
      omit(['not', 'in'] as const)
    );
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});

test('type for curried form', () => {
  const omitFoo = omit(['foo']);

  const result = omitFoo({ foo: 1, bar: 'potato' });

  expectTypeOf(result).toEqualTypeOf<{ bar: string }>();
});
