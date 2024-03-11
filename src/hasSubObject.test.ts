import { hasSubObject } from "./hasSubObject";
import { pipe } from "./pipe";
import type { Simplify } from "./type-fest/simplify";

describe("data first", () => {
  test("works with empty sub-object", () => {
    expect(hasSubObject({ a: 1, b: "b", c: 3 }, {})).toBe(true);
    expect(hasSubObject({}, {})).toBe(true);
  });

  test("works with primitives", () => {
    expect(hasSubObject({ a: 1, b: "b", c: 3 }, { a: 1, b: "b" })).toBe(true);
    expect(hasSubObject({ a: 1, b: "c", c: 3 }, { a: 1, b: "b" })).toBe(false);
    expect(hasSubObject({ a: 2, b: "b", c: 3 }, { a: 1, b: "b" })).toBe(false);
  });

  test("works with deep objects", () => {
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 2 } })).toBe(
      true,
    );
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1, c: 0 } })).toBe(
      false,
    );
  });
});

describe("data last", () => {
  test("empty sub-object", () => {
    expect(pipe({ a: 1, b: 2, c: 3 }, hasSubObject({}))).toBe(true);
    expect(pipe({}, hasSubObject({}))).toBe(true);
  });

  test("works with primitives", () => {
    expect(pipe({ a: 1, b: "b", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      true,
    );
    expect(pipe({ a: 1, b: "c", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      false,
    );
    expect(pipe({ a: 2, b: "b", c: 3 }, hasSubObject({ a: 1, b: "b" }))).toBe(
      false,
    );
  });

  test("works with deep objects", () => {
    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 2 } })),
    ).toBe(true);

    expect(pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1 } }))).toBe(
      false,
    );
  });
});

describe("typing", () => {
  describe("data-first", () => {
    test("must have matching keys and values", () => {
      expectTypeOf(hasSubObject({ a: 2 }, { a: 1 })).toEqualTypeOf<boolean>();

      // @ts-expect-error - missing a key
      hasSubObject({ b: 2 }, { a: 1 });

      // @ts-expect-error - different value type
      hasSubObject({ a: "a" }, { a: 1 });

      // ok - wider value type
      hasSubObject({ a: "a" } as { a: number | string }, { a: 1 });

      // @ts-expect-error - narrower value type
      hasSubObject({ a: "a" }, { a: 1 } as { a: number | string });

      // ok - unknown data type
      expectTypeOf(
        hasSubObject({ a: 2 } as unknown, { a: 1 }),
      ).toEqualTypeOf<boolean>();

      // ok - const value
      expectTypeOf(
        hasSubObject({ a: 2 }, { a: 1 } as const),
      ).toEqualTypeOf<boolean>();
    });

    test("allows nested objects", () => {
      // ok - nested object has extra keys
      expectTypeOf(
        hasSubObject({ a: { b: 4 } }, { a: { b: 1, c: 2 } }),
      ).toEqualTypeOf<boolean>();

      // @ts-expect-error - nested object has missing keys
      hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1 } });

      // @ts-expect-error - nested object has wrong value types
      hasSubObject({ a: { b: 4, c: "c" } }, { a: { b: 1, c: 2 } });
    });

    test("narrows type", () => {
      const obj = {} as { a?: string; b?: number };

      if (hasSubObject(obj, { a: "a" })) {
        expectTypeOf(obj).toEqualTypeOf<{ a: string; b?: number }>();
      }

      if (hasSubObject(obj, { a: "a" } as const)) {
        expectTypeOf(obj).toEqualTypeOf<{ a: "a"; b?: number }>();
      }
    });
  });

  describe("data-last", () => {
    test("must have matching keys and values", () => {
      expectTypeOf(hasSubObject({ a: 1 })).toEqualTypeOf<
        <T extends { a: number }>(
          data: T,
        ) => data is Simplify<T & { a: number }>
      >();

      expectTypeOf(hasSubObject({ a: 1 })({ a: 2 })).toEqualTypeOf<boolean>();

      // @ts-expect-error - missing a key
      hasSubObject({ a: 1 })({ b: 2 });

      // @ts-expect-error - different value type
      hasSubObject({ a: 1 })({ a: "a" });

      // @ts-expect-error - wider value type
      hasSubObject({ a: 1 })({ a: "a" } as { a: number | string });

      // ok - narrower value type
      hasSubObject({ a: 1 } as { a: number | string })({ a: "a" });

      // @ts-expect-error - unknown data type
      hasSubObject({ a: 1 })({ a: 2 } as unknown);

      // @ts-expect-error - wrong value type
      hasSubObject({ a: 1 } as const)({ a: 2 });
    });

    test("allows nested objects", () => {
      expectTypeOf(hasSubObject({ a: { b: 1, c: 2 } })).toEqualTypeOf<
        <T extends { a: { b: number; c: number } }>(
          data: T,
        ) => data is Simplify<T & { a: { b: number; c: number } }>
      >();

      // @ts-expect-error - nested object has extra keys
      hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 4 } });

      // ok - nested object has missing keys
      expectTypeOf(
        hasSubObject({ a: { b: 1 } })({ a: { b: 1, c: 2 } }),
      ).toEqualTypeOf<boolean>();

      // @ts-expect-error - nested object has wrong value types
      hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 4, c: "c" } });
    });
  });
});
