import { hasSubObject } from "./hasSubObject";
import { pipe } from "./pipe";

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

  test("checks for matching key", () => {
    const data: { a?: undefined } = {};
    expect(hasSubObject(data, { a: undefined })).toBe(false);
  });

  test("allows weird arguments", () => {
    expect(hasSubObject(new Error("a"), { message: "a" })).toBe(true);
    expect(hasSubObject(new Error("a"), { message: "b" })).toBe(false);

    // Error has no enumerable properties, so this is true:
    expect(hasSubObject(new Error("a"), new Error("b"))).toBe(true);

    expect(hasSubObject(["a", "b"], ["a"])).toBe(true);
    expect(hasSubObject(["a"], ["a", "b"])).toBe(false);

    expect(hasSubObject("ab", "a")).toBe(true);
    expect(hasSubObject("a", "ab")).toBe(false);
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

    expect(
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1, c: 3 } })),
    ).toBe(false);
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
      hasSubObject({ a: 2 } as unknown, { a: 1 });

      // ok - const value
      hasSubObject({ a: 2 }, { a: 1 } as const);
    });

    test("allows nested objects", () => {
      // ok - nested object has extra keys
      hasSubObject({ a: { b: 4 } }, { a: { b: 1, c: 2 } });

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
      expectTypeOf(
        pipe({ a: 2 }, hasSubObject({ a: 1 })),
      ).toEqualTypeOf<boolean>();

      // @ts-expect-error - missing a key
      pipe({ b: 2 }, hasSubObject({ a: 1 }));

      // @ts-expect-error - different value type
      pipe({ a: "a" }, hasSubObject({ a: 1 }));

      // ok - wider value type
      pipe({ a: "a" } as { a: number | string }, hasSubObject({ a: 1 }));

      // @ts-expect-error - narrower value type
      pipe({ a: "a" }, hasSubObject({ a: 1 } as { a: number | string }));

      // ok - unknown data type
      pipe({ a: 2 } as unknown, hasSubObject({ a: 1 }));

      // ok - const value
      pipe({ a: 2 }, hasSubObject({ a: 1 } as const));
    });

    test("allows nested objects", () => {
      // ok - nested object has extra keys
      pipe({ a: { b: 4 } }, hasSubObject({ a: { b: 1, c: 2 } }));

      // @ts-expect-error - nested object has missing keys
      pipe({ a: { b: 1, c: 2 } }, hasSubObject({ a: { b: 1 } }));

      // @ts-expect-error - nested object has wrong value types
      pipe({ a: { b: 4, c: "c" } }, hasSubObject({ a: { b: 1, c: 2 } }));
    });
  });
});
