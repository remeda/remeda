import { differenceWith } from "./differenceWith";
import { isShallowEqual } from "./isShallowEqual";

describe("runtime", () => {
  describe("primitives", () => {
    test("undefined", () => {
      expect(isShallowEqual(undefined, undefined)).toBe(true);
    });

    test("null", () => {
      expect(isShallowEqual(null, null)).toBe(true);
    });

    test("string", () => {
      expect(isShallowEqual("a", "a")).toBe(true);
      expect(isShallowEqual("a", "b")).toBe(false);
    });

    test("number", () => {
      expect(isShallowEqual(1, 1)).toBe(true);
      expect(isShallowEqual(1, 2)).toBe(false);
    });

    test("boolean", () => {
      expect(isShallowEqual(true, true)).toBe(true);
      expect(isShallowEqual(true, false)).toBe(false);
    });

    test("bigint", () => {
      expect(isShallowEqual(1n, 1n)).toBe(true);
      expect(isShallowEqual(1n, 2n)).toBe(false);
    });
  });

  describe("objects", () => {
    test("arrays", () => {
      const data = [1, 2, 3];
      expect(isShallowEqual(data, [1, 2, 3])).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, [1, 2])).toBe(false);
    });

    test("objects", () => {
      const data = { a: 1, b: 2 } as Record<string, number>;
      expect(isShallowEqual(data, { a: 1, b: 2 })).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, { a: 1 })).toBe(false);
      expect(isShallowEqual(data, { a: 1, c: 3 })).toBe(false);
    });

    test("uint arrays", () => {
      const data = new Uint8Array([1, 2, 3]);
      expect(isShallowEqual(data, new Uint8Array([1, 2, 3]))).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, new Uint8Array([1, 2]))).toBe(false);
    });

    test("maps", () => {
      const data = new Map([["a", 1]]);
      expect(isShallowEqual(data, new Map([["a", 1]]))).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, new Map([["a", 2]]))).toBe(false);
      expect(
        isShallowEqual(
          data,
          new Map([
            ["a", 1],
            ["b", 2],
          ]),
        ),
      ).toBe(false);
    });

    test("sets", () => {
      const data = new Set([1, 2, 3]);
      expect(isShallowEqual(data, new Set([1, 2, 3]))).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, new Set([1, 2]))).toBe(false);
      expect(isShallowEqual(data, new Set([4, 5, 6]))).toBe(false);
    });
  });

  describe("built-ins", () => {
    test("regex", () => {
      const data = /a/u;
      expect(isShallowEqual(data, /a/u)).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, /b/u)).toBe(true);
    });

    test("dates", () => {
      const data = new Date();
      expect(isShallowEqual(data, new Date())).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, new Date(data.getTime() + 1))).toBe(true);
    });

    test("promises", () => {
      const data = Promise.resolve(1);
      expect(isShallowEqual(data, Promise.resolve(1))).toBe(true);
      expect(isShallowEqual(data, data)).toBe(true);

      expect(isShallowEqual(data, Promise.resolve(2))).toBe(true);
    });
  });

  describe("shallow inequality", () => {
    test("arrays of objects", () => {
      const a = { a: 1 };
      expect(isShallowEqual([a], [a])).toBe(true);
      expect(isShallowEqual([a], [{ a: 1 }])).toBe(false);
    });

    test("arrays of arrays", () => {
      const a = [1];
      expect(isShallowEqual([a], [a])).toBe(true);
      expect(isShallowEqual([a], [[1]])).toBe(false);
    });

    test("objects of arrays", () => {
      const a = [1];
      expect(isShallowEqual({ a }, { a })).toBe(true);
      expect(isShallowEqual({ a }, { a: [1] })).toBe(false);
    });

    test("objects of objects", () => {
      const a = { b: 1 };
      expect(isShallowEqual({ a }, { a })).toBe(true);
      expect(isShallowEqual({ a }, { a: { b: 1 } })).toBe(false);
    });
  });
});

describe("typing", () => {
  it("narrows unions", () => {
    const data = 1 as number | string;

    if (isShallowEqual(data, 1)) {
      expectTypeOf(data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }

    if (isShallowEqual(data, "hello")) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }
  });

  it("narrows to literal", () => {
    const data = 1 as number;
    if (isShallowEqual(data, 1 as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it("doesn't accept non-overlapping types", () => {
    // @ts-expect-error [ts2345] - Checking against the wrong type should fail
    isShallowEqual(1 as number, true);
  });

  it("works deeply", () => {
    const data = [] as Array<
      { a: Array<number> | Array<string> } | { b: Array<boolean> }
    >;
    if (isShallowEqual(data, [{ a: [1] }])) {
      expectTypeOf(data).toEqualTypeOf<Array<{ a: Array<number> }>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<
        Array<
          | {
              a: Array<number> | Array<string>;
            }
          | {
              b: Array<boolean>;
            }
        >
      >();
    }
  });

  it("doesn't narrow when comparing objects of the same type", () => {
    const data1 = { a: 1 } as { a: number };
    const data2 = { a: 2 } as { a: number };
    if (isShallowEqual(data1, data2)) {
      expectTypeOf(data1).toEqualTypeOf<{ a: number }>();
    } else {
      expectTypeOf(data1).toEqualTypeOf<{ a: number }>();
    }
  });

  it("headless usage can infer types", () => {
    // Tests the issue reported in: https://github.com/remeda/remeda/issues/641
    const result = differenceWith(
      ["a", "b", "c"],
      ["a", "c", "d"],
      isShallowEqual,
    );
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });
});
