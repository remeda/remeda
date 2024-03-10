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
    expect(hasSubObject({ a: { b: 1, c: 2 } }, { a: { b: 1 } })).toBe(false);
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
  test("must have matching keys and values", () => {
    expectTypeOf(hasSubObject({ a: 1 })).toEqualTypeOf<
      <T extends { a: number } = { a: number }>(object: T) => boolean
    >();

    expectTypeOf(hasSubObject({ a: 1 })({ a: 2 })).toEqualTypeOf<boolean>();

    // @ts-expect-error - missing a key
    hasSubObject({ a: 1 })({ b: 2 });

    // @ts-expect-error - wrong value type
    hasSubObject({ a: 1 })({ a: "a" });

    // @ts-expect-error - wrong value type
    hasSubObject({ a: 1 } as const)({ a: 2 });
  });

  test("allows nested objects", () => {
    expectTypeOf(hasSubObject({ a: { b: 1, c: 2 } })).toEqualTypeOf<
      <
        T extends { a: { b: number; c: number } } = {
          a: { b: number; c: number };
        },
      >(
        object: T,
      ) => boolean
    >();

    // @ts-expect-error - nested object missing keys
    hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 4 } });

    // @ts-expect-error - nested object has wrong value types
    hasSubObject({ a: { b: 1, c: 2 } })({ a: { b: 4, c: "c" } });
  });
});
