import { toPairs } from './toPairs';

describe('toPairs', () => {
  test('should return pairs', () => {
    const actual = toPairs({ a: 1, b: 2, c: 3 });
    expect(actual).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  describe('typing', () => {
    test('with known properties', () => {
      const actual = toPairs({ a: 1, b: 2, c: 3 });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, number]>>();
    });

    test('with optional properties', () => {
      const actual = toPairs({} as { a?: string });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, string]>>();
    });

    test('with undefined properties', () => {
      const actual = toPairs({ a: undefined } as {
        a: string | undefined;
      });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, string | undefined]>>();
    });

    test('with unknown properties', () => {
      const actual = toPairs({} as Record<string, unknown>);
      expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
    });
  });
});

describe('toPairs.strict', () => {
  test('should return pairs', () => {
    const actual = toPairs.strict({ a: 1, b: 2, c: 3 });
    expect(actual).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  describe('typing', () => {
    test('with known properties', () => {
      const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as const);
      expectTypeOf(actual).toEqualTypeOf<
        Array<['a', 1] | ['b', 2] | ['c', 3]>
      >();
    });

    test('with optional properties', () => {
      const actual = toPairs.strict({} as { a?: string });
      expectTypeOf(actual).toEqualTypeOf<Array<['a', string]>>();
    });

    test('with undefined properties', () => {
      const actual = toPairs.strict({ a: undefined } as {
        a: string | undefined;
      });
      expectTypeOf(actual).toEqualTypeOf<Array<['a', string | undefined]>>();
    });

    test('with unknown properties', () => {
      const actual = toPairs.strict({} as Record<string, unknown>);
      expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
    });
  });
});
