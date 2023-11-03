import { mapValues } from './mapValues';
import { pipe } from './pipe';

describe('data first', () => {
  test('mapValues', () => {
    expect(
      mapValues(
        {
          a: 1,
          b: 2,
        },
        (value, key) => `${value}${key}`
      )
    ).toEqual({
      a: '1a',
      b: '2b',
    });
  });
});

describe('data last', () => {
  test('mapValues', () => {
    expect(
      pipe(
        {
          a: 1,
          b: 2,
        },
        mapValues((value, key) => `${value}${key}`)
      )
    ).toEqual({
      a: '1a',
      b: '2b',
    });
  });
});

describe('mapValues key types', () => {
  describe('interface', () => {
    test('should set the type of the key to be the union of the keys of the object', () => {
      mapValues({} as { foo: unknown; bar: unknown }, (_, key) =>
        expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
      );
    });

    test('should exclude symbols from keys', () => {
      const mySymbol = Symbol('mySymbol');
      mapValues(
        {} as { [mySymbol]: unknown; foo: unknown; bar: unknown },
        (_, key) => expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
      );
    });
  });

  describe('mapped type', () => {
    test('should work with string keys', () => {
      mapValues({} as { [K in string]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<string>();
      });
    });
    test('should work with number keys', () => {
      mapValues({} as { [K in number]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`${number}`>();
      });
    });
    test('should work with template literal string keys', () => {
      mapValues({} as { [K in `prefix${string}`]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
      });
    });
    test('should not work with symbol keys', () => {
      mapValues({} as { [K in symbol]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<never>();
      });
    });
  });

  test('indexed signature', () => {
    test('should work with string keys', () => {
      mapValues({} as { [key: string]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<string>();
      });
    });
    test('should work with number keys', () => {
      mapValues({} as { [key: number]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`${number}`>();
      });
    });
    test('should work with template literal string keys', () => {
      mapValues({} as { [key: `prefix${string}`]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
      });
    });
    test('should not work with symbol keys', () => {
      mapValues({} as { [key: symbol]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<never>();
      });
    });
    /* eslint-enable @typescript-eslint/consistent-indexed-object-style */
  });
});
