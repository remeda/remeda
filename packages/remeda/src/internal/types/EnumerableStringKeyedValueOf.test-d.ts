import type { EmptyObject } from "type-fest";
import { expectTypeOf, test } from "vitest";
import type { EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf";

declare const SYMBOL: unique symbol;

declare function enumerableStringKeyedValueOf<const T>(
  data: T,
): EnumerableStringKeyedValueOf<T>;

test("string values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as Record<PropertyKey, string>),
  ).toEqualTypeOf<string>();
});

test("number values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as Record<PropertyKey, number>),
  ).toEqualTypeOf<number>();
});

test("union of records", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey, "cat"> | Record<PropertyKey, "dog">,
    ),
  ).toEqualTypeOf<"cat" | "dog">();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey, number> | Record<PropertyKey, string>,
    ),
  ).toEqualTypeOf<number | string>();
});

test("union values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as Record<PropertyKey, number | string>),
  ).toEqualTypeOf<number | string>();
});

test("literal values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 1 } as const),
  ).toEqualTypeOf<1>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 1 } as { a: "1" | "2" | 1 }),
  ).toEqualTypeOf<"1" | "2" | 1>();
});

test("optional values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ a: 1 } as { a: 1; b?: 4 }),
  ).toEqualTypeOf<1 | 4>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ a: "hello" } as { a: string; b?: number }),
  ).toEqualTypeOf<number | string>();
});

test("nullish and undefined values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ a: "hello", b: "world" } as {
      a: string | undefined;
      b: string | null;
    }),
  ).toEqualTypeOf<string | null | undefined>();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as {
        a?: number | null;
        b?: number | null | undefined;
      },
    ),
  ).toEqualTypeOf<number | null | undefined>();
});

test("symbol keys", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({ [SYMBOL]: "hello" } as const),
  ).toEqualTypeOf<never>();

  expectTypeOf(
    enumerableStringKeyedValueOf({ [SYMBOL]: "hello", b: "1" } as const),
  ).toEqualTypeOf<"1">();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey | typeof SYMBOL, string>,
    ),
  ).toEqualTypeOf<string>();
});

test("empty object", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as EmptyObject),
  ).toEqualTypeOf<never>();
});

// @see https://github.com/remeda/remeda/issues/1122
test("parameterized record key (Issue #1122)", () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping -- A generic function is the only way to introduce a free type parameter for testing.
  const foo = <K extends string>(data: Record<K, { a: "hello" }>): void => {
    // Because of the type parameter TypeScript doesn't infer the concrete
    // return type here, preventing us from being able to compare it to an
    // expected type (that doesn't use EnumerableStringKeyedValueOf itself);
    // but once we treat it as an object by accessing a specific property
    // TypeScript attempts to eagerly infer it (and succeeds). This provides us
    // a good enough workaround for testing the expected type.
    // @see https://github.com/microsoft/TypeScript/issues/48810
    const { a } = enumerableStringKeyedValueOf(data);

    expectTypeOf(a).toEqualTypeOf<"hello">();
  };

  // We need to "use" the function above to prevent GitHub's CodeQL from
  // surfacing it as unused (`js/unused-local-variable`), which it technically
  // is, albeit this being a **type test** where execution is meaningless to
  // begin with...
  void foo;
});
