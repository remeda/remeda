import { pipe } from "./pipe";
import { toPairs } from "./toPairs";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(toPairs({ a: 1, b: 2, c: 3 })).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  test("dataLast", () => {
    expect(toPairs()({ a: 1, b: 2, c: 3 })).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  test('"headless" dataLast', () => {
    // Older versions of Remeda didn't provide a native dataLast impl and
    // suggested users use a "headless" version of the dataFirst impl to get the
    // dataLast behavior.
    // TODO: Remove this test once we release Remeda v2 where we won't
    // officially continue to support this.
    expect(pipe({ a: 1, b: 2, c: 3 }, toPairs)).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  describe("typing", () => {
    test("with known properties", () => {
      const actual = toPairs({ a: 1, b: 2, c: 3 });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, number]>>();
    });

    test("with optional properties", () => {
      const actual = toPairs({} as { a?: string });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, string]>>();
    });

    test("with undefined properties", () => {
      const actual = toPairs({ a: undefined } as {
        a: string | undefined;
      });
      expectTypeOf(actual).toEqualTypeOf<Array<[string, string | undefined]>>();
    });

    test("with unknown properties", () => {
      const actual = toPairs({} as Record<string, unknown>);
      expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
    });
  });
});

describe("toPairs.strict", () => {
  test("should return pairs", () => {
    const actual = toPairs.strict({ a: 1, b: 2, c: 3 });
    expect(actual).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  describe("typing", () => {
    test("with known properties", () => {
      const actual = toPairs.strict({ a: 1, b: 2, c: 3 } as const);
      expectTypeOf(actual).toEqualTypeOf<
        Array<["a", 1] | ["b", 2] | ["c", 3]>
      >();
    });

    test("with optional properties", () => {
      const actual = toPairs.strict({} as { a?: string });
      expectTypeOf(actual).toEqualTypeOf<Array<["a", string]>>();
    });

    test("with undefined properties", () => {
      const actual = toPairs.strict({ a: undefined } as {
        a: string | undefined;
      });
      expectTypeOf(actual).toEqualTypeOf<Array<["a", string | undefined]>>();
    });

    test("with unknown properties", () => {
      const actual = toPairs.strict({} as Record<string, unknown>);
      expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
    });
  });
});
