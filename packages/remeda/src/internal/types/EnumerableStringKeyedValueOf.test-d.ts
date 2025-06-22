import type { EmptyObject } from "type-fest";
import type { EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf";

declare function enumerableStringKeyedValueOf<const T>(
  data: T,
): EnumerableStringKeyedValueOf<T>;

declare const SymbolFoo: unique symbol;

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
    enumerableStringKeyedValueOf({} as { a: "1" | "2" | 1 }),
  ).toEqualTypeOf<"1" | "2" | 1>();
});

test("optional values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as { a: 1; b?: 4 }),
  ).toEqualTypeOf<1 | 4>();

  expectTypeOf(
    enumerableStringKeyedValueOf({} as { a: string; b?: number }),
  ).toEqualTypeOf<number | string>();
});

test("nullish and undefined values", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as {
        a: string | undefined;
        b: string | null;
      },
    ),
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
    enumerableStringKeyedValueOf({} as { [SymbolFoo]: string }),
  ).toEqualTypeOf<never>();

  expectTypeOf(
    enumerableStringKeyedValueOf({} as { [SymbolFoo]: string; b: "1" }),
  ).toEqualTypeOf<"1">();

  expectTypeOf(
    enumerableStringKeyedValueOf(
      {} as Record<PropertyKey | typeof SymbolFoo, string>,
    ),
  ).toEqualTypeOf<string>();
});

test("empty object", () => {
  expectTypeOf(
    enumerableStringKeyedValueOf({} as EmptyObject),
  ).toEqualTypeOf<never>();
});

test("parameterized record key (Issue #1122)", () => {
  // @ts-expect-error [ts6133] -- Only functions allow us to define a parametrized record (I think...)
  // eslint-disable-next-line unicorn/consistent-function-scoping, @typescript-eslint/no-unused-vars -- The function inside this test IS the main point of the test and can't be pulled out or used.
  const foo = <K extends string>(data: Record<K, { a: "hello" }>): void => {
    // TypeScript/Vitest (?!) is failing to infer the result of our function
    // on this type directly, but still manages to typecheck it once we
    // destructure the result and only test the type of the property. I don't
    // know why that is and if there's any better more idiomatic way to do this.
    const { a } = enumerableStringKeyedValueOf(data);

    expectTypeOf(a).toEqualTypeOf<"hello">();
  };
});
