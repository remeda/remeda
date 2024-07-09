import { differenceWith } from "./differenceWith";
import { isStrictEqual } from "./isStrictEqual";

describe("runtime", () => {
  describe("primitives", () => {
    test("undefined", () => {
      expect(isStrictEqual(undefined, undefined)).toBe(true);
    });

    test("null", () => {
      expect(isStrictEqual(null, null)).toBe(true);
    });

    test("string", () => {
      expect(isStrictEqual("a", "a")).toBe(true);
      expect(isStrictEqual("a", "b")).toBe(false);
    });

    test("number", () => {
      expect(isStrictEqual(1, 1)).toBe(true);
      expect(isStrictEqual(1, 2)).toBe(false);
    });

    test("boolean", () => {
      expect(isStrictEqual(true, true)).toBe(true);
      expect(isStrictEqual(true, false)).toBe(false);
    });

    test("bigint", () => {
      expect(isStrictEqual(1n, 1n)).toBe(true);
      expect(isStrictEqual(1n, 2n)).toBe(false);
    });
  });

  describe("objects", () => {
    test("arrays", () => {
      const data = [1, 2, 3];
      expect(isStrictEqual(data, [1, 2, 3])).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });

    test("objects", () => {
      const data = { a: 1, b: 2 };
      expect(isStrictEqual(data, { a: 1, b: 2 })).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });

    test("uint arrays", () => {
      const data = new Uint8Array([1, 2, 3]);
      expect(isStrictEqual(data, new Uint8Array([1, 2, 3]))).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });

    test("maps", () => {
      const data = new Map([["a", 1]]);
      expect(isStrictEqual(data, new Map([["a", 1]]))).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });

    test("sets", () => {
      const data = new Set([1, 2, 3]);
      expect(isStrictEqual(data, new Set([1, 2, 3]))).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });
  });

  describe("built-ins", () => {
    test("regex", () => {
      const data = /a/u;
      expect(isStrictEqual(data, /a/u)).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });

    test("dates", () => {
      const data = new Date();
      expect(isStrictEqual(data, new Date())).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });

    test("promises", () => {
      const data = Promise.resolve(1);
      expect(isStrictEqual(data, Promise.resolve(1))).toBe(false);
      expect(isStrictEqual(data, data)).toBe(true);
    });
  });

  describe("special cases", () => {
    test("NaN", () => {
      // eslint-disable-next-line unicorn/prefer-number-properties
      expect(isStrictEqual(NaN, NaN)).toBe(true);
      expect(isStrictEqual(Number.NaN, Number.NaN)).toBe(true);
    });

    test("-0", () => {
      expect(isStrictEqual(-0, 0)).toBe(true);
      expect(isStrictEqual(-0, -0)).toBe(true);
      expect(isStrictEqual(0, 0)).toBe(true);
    });

    it("fails on loose equality", () => {
      expect(isStrictEqual("" as unknown, 0)).toBe(false);
      expect(isStrictEqual("" as unknown, false)).toBe(false);
      expect(isStrictEqual(0 as unknown, false)).toBe(false);
      expect(isStrictEqual("" as unknown, null)).toBe(false);
      expect(isStrictEqual("" as unknown, undefined)).toBe(false);
      expect(isStrictEqual(0 as unknown, null)).toBe(false);
      expect(isStrictEqual(0 as unknown, undefined)).toBe(false);
      expect(isStrictEqual(false as unknown, null)).toBe(false);
      expect(isStrictEqual(false as unknown, undefined)).toBe(false);
    });
  });
});

describe("typing", () => {
  it("narrows unions", () => {
    const data = 1 as number | string;

    if (isStrictEqual(data, 1)) {
      expectTypeOf(data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }

    if (isStrictEqual(data, "hello")) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }
  });

  it("narrows to literal", () => {
    const data = 1 as number;
    if (isStrictEqual(data, 1 as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it("doesn't accept non-overlapping types", () => {
    // @ts-expect-error [ts2345] - Checking against the wrong type should fail
    isStrictEqual(1 as number, true);
  });

  it("works deeply", () => {
    const data = [] as Array<
      { a: Array<number> | Array<string> } | { b: Array<boolean> }
    >;
    if (isStrictEqual(data, [{ a: [1] }])) {
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
    if (isStrictEqual(data1, data2)) {
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
      isStrictEqual,
    );
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });
});
