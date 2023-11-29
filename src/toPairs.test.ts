import { toPairs } from './toPairs';

test('should return pairs', () => {
  const actual = toPairs({ a: 1, b: 2, c: 3 });
  expect(actual).toEqual([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]);
});

it('should accept interface types', () => {
  interface T {
    a: string;
  }

  expectTypeOf(toPairs<T>({ a: 'b' })).toEqualTypeOf<Array<[string, string]>>();
});

describe('stricter', () => {
  test('should return pairs', () => {
    const actual = toPairs.strict({ a: 1, b: 2, c: 3 });
    expect(actual).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });

  test('typing', () => {
    const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as const);
    assertType<Array<['a' | 'b' | 'c', 1 | 2 | 3]>>(actual);
  });

  test('typing with optional', () => {
    const actual = toPairs.strict({} as { a?: string });
    assertType<Array<['a', string]>>(actual);
  });

  test('typing with undefined', () => {
    const actual = toPairs.strict({ a: undefined } as {
      a: string | undefined;
    });
    assertType<Array<['a', string | undefined]>>(actual);
  });

  test('with a broad type', () => {
    const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as Record<
      string,
      unknown
    >);

    assertType<Array<[string, unknown]>>(actual);
  });
});
