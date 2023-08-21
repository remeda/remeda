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

  test('mapped type', () => {
    mapValues({} as { [K in string]: unknown }, (_, key) => {
      expectTypeOf(key).toEqualTypeOf<string>();
    });
  });

  test('indexed signature', () => {
    mapValues(
      // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style -- must be "indexed signature"
      {} as { [key: string]: unknown },
      (_, key) => {
        expectTypeOf(key).toEqualTypeOf<string>();
      }
    );
  });
});
