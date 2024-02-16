import { hasSubobject } from './hasSubobject';
import { pipe } from './pipe';

describe('data first', () => {
  test('works with empty subobject', () => {
    expect(hasSubobject({ a: 1, b: 'b', c: 3 }, {})).toBe(true);
    expect(hasSubobject({}, {})).toBe(true);
  });

  test('works with primitives', () => {
    expect(hasSubobject({ a: 1, b: 'b', c: 3 }, { a: 1, b: 'b' })).toBe(true);
    expect(hasSubobject({ a: 1, b: 'c', c: 3 }, { a: 1, b: 'b' })).toBe(false);
    expect(hasSubobject({ a: 2, b: 'b', c: 3 }, { a: 1, b: 'b' })).toBe(false);
  });

  test('works with deep objects', () => {
    expect(hasSubobject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } })).toBe(
      true
    );
    expect(hasSubobject({ a: { b: 1, c: 2 } }, { a: { b: 1 } })).toBe(false);
  });
});

describe('data last', () => {
  test('empty subobject', () => {
    expect(pipe({ a: 1, b: 2, c: 3 }, hasSubobject({}))).toBe(true);
    expect(pipe({}, hasSubobject({}))).toBe(true);
  });

  test('works with primitives', () => {
    expect(pipe({ a: 1, b: 'b', c: 3 }, hasSubobject({ a: 1, b: 'b' }))).toBe(
      true
    );
    expect(pipe({ a: 1, b: 'c', c: 3 }, hasSubobject({ a: 1, b: 'b' }))).toBe(
      false
    );
    expect(pipe({ a: 2, b: 'b', c: 3 }, hasSubobject({ a: 1, b: 'b' }))).toBe(
      false
    );
  });

  test('works with deep objects', () => {
    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubobject({ a: { b: 1, c: 2 } }))
    ).toBe(true);
    expect(pipe({ a: { b: 1, c: 2 } }, hasSubobject({ a: { b: 1 } }))).toBe(
      false
    );
  });
});

describe('typing', () => {
  test('must have matching keys and values', () => {
    expectTypeOf(hasSubobject({ a: 1 })).toEqualTypeOf<
      <T extends { a: number }>(object: T) => boolean
    >();

    expectTypeOf(hasSubobject({ a: 1 })({ a: 2 })).toEqualTypeOf<boolean>();

    // @ts-expect-error - missing a key
    hasSubobject({ a: 1 })({ b: 2 });

    // @ts-expect-error - wrong value type
    hasSubobject({ a: 1 })({ a: 'a' });
  });

  test('allows nested objects', () => {
    expectTypeOf(hasSubobject({ a: { b: 1, c: 2 } })).toEqualTypeOf<
      <T extends { a: { b: number; c: number } }>(object: T) => boolean
    >();

    // @ts-expect-error - nested object missing keys
    hasSubobject({ a: { b: 1, c: 2 } })({ a: { b: 4 } });

    // @ts-expect-error - nested object has wrong value types
    hasSubobject({ a: { b: 1, c: 2 } })({ a: { b: 4, c: 'c' } });
  });
});
