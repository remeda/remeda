import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { constant } from "./constant";
import { identity } from "./identity";
import { mapKeys } from "./mapKeys";
import { pipe } from "./pipe";

declare const SYMBOL: unique symbol;

// @see https://github.com/remeda/remeda/issues/1249
describe("single bounded mapped key (Issue #1249)", () => {
  test("empty object", () => {
    expectTypeOf(mapKeys({}, constant("hello"))).toEqualTypeOf<{
      hello?: never;
    }>();
  });

  test("primitive unbounded record", () => {
    expectTypeOf(
      mapKeys({} as Record<string, string>, constant("hello")),
    ).toEqualTypeOf<{ hello?: string }>();
  });

  test("possibly empty record", () => {
    expectTypeOf(
      mapKeys({} as { a?: "world" }, constant("hello")),
    ).toEqualTypeOf<{ hello?: "world" }>();
  });

  test("object with single key", () => {
    expectTypeOf(mapKeys({ foo: 69 } as const, identity())).toEqualTypeOf<{
      foo: 69;
    }>();
    expectTypeOf(mapKeys({ foo: 69 } as const, constant("bar"))).toEqualTypeOf<{
      bar: 69;
    }>();
  });

  test("object with multiple keys", () => {
    expectTypeOf(mapKeys({ a: 1, b: 2 }, constant("x"))).toEqualTypeOf<{
      x: number;
    }>();
  });
});

test("simple string records", () => {
  const result = mapKeys(
    {} as Record<string, string>,
    constant($typed<string>()),
  );

  expectTypeOf(result).toEqualTypeOf<Record<string, string>>();
});

test("simple number records", () => {
  const result = mapKeys(
    {} as Record<number, number>,
    constant($typed<number>()),
  );

  expectTypeOf(result).toEqualTypeOf<Record<number, number>>();
});

test("mapping to a string literal", () => {
  const result = mapKeys(
    {} as Record<number, number>,
    constant($typed<"cat" | "dog">()),
  );

  expectTypeOf(result).toEqualTypeOf<Partial<Record<"cat" | "dog", number>>>();
});

test("symbols are not passed to the mapper", () => {
  mapKeys({ [SYMBOL]: 1, b: "hellO", c: true }, (key, value) => {
    expectTypeOf(key).toEqualTypeOf<"b" | "c">();
    expectTypeOf(value).toEqualTypeOf<boolean | string>();

    return 3;
  });
});

test("symbols can be used as the return value", () => {
  expectTypeOf(mapKeys({ a: 1 }, constant(SYMBOL))).toEqualTypeOf<
    Record<typeof SYMBOL, number>
  >();
});

test("number keys are converted to strings", () => {
  mapKeys({ 123: "abc", 456: "def" }, (key, value) => {
    expectTypeOf(key).toEqualTypeOf<"123" | "456">();
    expectTypeOf(value).toEqualTypeOf<string>();

    return key;
  });
});

test("numbers returned from the mapper are used as-is", () => {
  expectTypeOf(mapKeys({ a: "b" }, constant(123))).toEqualTypeOf<
    Record<123, string>
  >();
});

test("union of records", () => {
  const data = {} as Record<PropertyKey, "cat"> | Record<PropertyKey, "dog">;

  const dataFirst = mapKeys(data, constant($typed<string>()));

  expectTypeOf(dataFirst).toEqualTypeOf<Record<string, "cat" | "dog">>();

  const dataLast = pipe(data, mapKeys(constant($typed<string>())));

  expectTypeOf(dataLast).toEqualTypeOf<Record<string, "cat" | "dog">>();
});
