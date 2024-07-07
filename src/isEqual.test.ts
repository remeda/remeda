import { differenceWith } from "./differenceWith";
import { isEqual } from "./isEqual";

describe("runtime", () => {
  describe("primitives", () => {
    test("undefined", () => {
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    test("null", () => {
      expect(isEqual(null, null)).toBe(true);
    });

    test("string", () => {
      expect(isEqual("a", "a")).toBe(true);
      expect(isEqual("a", "b")).toBe(false);
    });

    test("number", () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual(1, 2)).toBe(false);
    });

    test("boolean", () => {
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(true, false)).toBe(false);
    });

    test("bigint", () => {
      expect(isEqual(1n, 1n)).toBe(true);
      expect(isEqual(1n, 2n)).toBe(false);
    });
  });

  describe("objects", () => {
    test("arrays", () => {
      const data = [1, 2, 3];
      expect(isEqual(data, [1, 2, 3])).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });

    test("objects", () => {
      const data = { a: 1, b: 2 };
      expect(isEqual(data, { a: 1, b: 2 })).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });

    test("uint arrays", () => {
      const data = new Uint8Array([1, 2, 3]);
      expect(isEqual(data, new Uint8Array([1, 2, 3]))).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });

    test("maps", () => {
      const data = new Map([["a", 1]]);
      expect(isEqual(data, new Map([["a", 1]]))).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });

    test("sets", () => {
      const data = new Set([1, 2, 3]);
      expect(isEqual(data, new Set([1, 2, 3]))).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });
  });

  describe("built-ins", () => {
    test("regex", () => {
      const data = /a/u;
      expect(isEqual(data, /a/u)).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });

    test("dates", () => {
      const data = new Date();
      expect(isEqual(data, new Date())).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });

    test("promises", () => {
      const data = Promise.resolve(1);
      expect(isEqual(data, Promise.resolve(1))).toBe(false);
      expect(isEqual(data, data)).toBe(true);
    });
  });

  describe("special cases", () => {
    test("NaN", () => {
      // eslint-disable-next-line unicorn/prefer-number-properties
      expect(isEqual(NaN, NaN)).toBe(true);
      expect(isEqual(Number.NaN, Number.NaN)).toBe(true);
    });

    test("-0", () => {
      expect(isEqual(-0, 0)).toBe(true);
      expect(isEqual(-0, -0)).toBe(true);
      expect(isEqual(0, 0)).toBe(true);
    });

    it("doesn't coalesce falsy values", () => {
      expect(isEqual("" as unknown, 0)).toBe(false);
      expect(isEqual("" as unknown, false)).toBe(false);
      expect(isEqual(0 as unknown, false)).toBe(false);
      expect(isEqual("" as unknown, null)).toBe(false);
      expect(isEqual("" as unknown, undefined)).toBe(false);
      expect(isEqual(0 as unknown, null)).toBe(false);
      expect(isEqual(0 as unknown, undefined)).toBe(false);
      expect(isEqual(false as unknown, null)).toBe(false);
      expect(isEqual(false as unknown, undefined)).toBe(false);
    });
  });
});

describe("typing", () => {
  it("narrows unions", () => {
    const data = 1 as number | string;

    if (isEqual(data, 1)) {
      expectTypeOf(data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }

    if (isEqual(data, "hello")) {
      expectTypeOf(data).toEqualTypeOf<string>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number | string>();
    }
  });

  it("narrows to literal", () => {
    const data = 1 as number;
    if (isEqual(data, 1 as const)) {
      expectTypeOf(data).toEqualTypeOf<1>();
    } else {
      expectTypeOf(data).toEqualTypeOf<number>();
    }
  });

  it("doesn't accept non-overlapping types", () => {
    // @ts-expect-error [ts2345] - Checking against the wrong type should fail
    isEqual(1 as number, true);
  });

  it("works deeply", () => {
    const data = [] as Array<
      { a: Array<number> | Array<string> } | { b: Array<boolean> }
    >;
    if (isEqual(data, [{ a: [1] }])) {
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
    if (isEqual(data1, data2)) {
      expectTypeOf(data1).toEqualTypeOf<{ a: number }>();
    } else {
      expectTypeOf(data1).toEqualTypeOf<{ a: number }>();
    }
  });

  it("headless usage can infer types", () => {
    // Tests the issue reported in: https://github.com/remeda/remeda/issues/641
    const result = differenceWith(["a", "b", "c"], ["a", "c", "d"], isEqual);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });
});
