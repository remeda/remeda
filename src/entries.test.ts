import { entries } from "./entries";

describe("runtime", () => {
  test("should return pairs", () => {
    expect(entries({ a: 1, b: 2, c: 3 })).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("typing", () => {
  test("with known properties", () => {
    const actual = entries({ a: 1, b: 2, c: 3 } as const);
    expectTypeOf(actual).toEqualTypeOf<Array<["a", 1] | ["b", 2] | ["c", 3]>>();
  });

  test("with optional properties", () => {
    const actual = entries({} as { a?: string });
    expectTypeOf(actual).toEqualTypeOf<Array<["a", string]>>();
  });

  test("with undefined properties", () => {
    const actual = entries({ a: undefined } as {
      a: string | undefined;
    });
    expectTypeOf(actual).toEqualTypeOf<Array<["a", string | undefined]>>();
  });

  test("with unknown properties", () => {
    const actual = entries({} as Record<string, unknown>);
    expectTypeOf(actual).toEqualTypeOf<Array<[string, unknown]>>();
  });
});
