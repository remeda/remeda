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
  test('interface', () => {
    mapValues({} as { foo: unknown; bar: unknown }, (_, key) =>
      expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
    );
  });

  test('interface with symbols', () => {
    const mySymbol = Symbol('mySymbol');
    mapValues(
      {} as { [mySymbol]: unknown; foo: unknown; bar: unknown },
      (_, key) => expectTypeOf(key).toEqualTypeOf<'foo' | 'bar'>()
    );
  });

  test('mapped type', () => {
    mapValues({} as { [K in string]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
    });
    mapValues({} as { [K in number]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`${number}`>();
    });
    mapValues({} as { [K in `prefix${string}`]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
    });
    mapValues({} as { [K in symbol]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<never>();
    });
  });

  test('indexed signature', () => {
    /* eslint-disable @typescript-eslint/consistent-indexed-object-style -- must be "indexed signature" */
    mapValues({} as { [key: string]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
    });
    mapValues({} as { [key: number]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`${number}`>();
    });
    mapValues({} as { [key: `prefix${string}`]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
    });
    mapValues({} as { [key: symbol]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<never>();
    });
    /* eslint-enable @typescript-eslint/consistent-indexed-object-style */
  });
});
