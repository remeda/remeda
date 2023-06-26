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
});

describe('data last', () => {
  test('omit', () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, omit(['a', 'd'] as const));
    expect(result).toEqual({ b: 2, c: 3 });
  });
});

test('type for curried form', () => {
  const omitFoo = omit(['foo']);

  const result = omitFoo({ foo: 1, bar: 'potato' });

  expectTypeOf(result).toEqualTypeOf<{ bar: string }>();
});
