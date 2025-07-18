import type { Tagged } from "type-fest";
import { expectTypeOf, test } from "vitest";
import type { EnumerableStringKeyOf } from "./EnumerableStringKeyOf";

declare const SymbolFoo: unique symbol;

declare function enumerableStringKeyOf<T>(data: T): EnumerableStringKeyOf<T>;

test("string keys", () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<string, unknown>),
  ).toEqualTypeOf<string>();
});

test("number keys", () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<number, unknown>),
  ).toEqualTypeOf<`${number}`>();
});

test("union of records", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      {} as Record<`prefix_${string}`, unknown> | Record<number, unknown>,
    ),
  ).toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

test("union keys", () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<number | `prefix_${string}`, unknown>),
  ).toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

test("union of records with branded keys", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      {} as
        | Record<Tagged<string, "coke">, unknown>
        | Record<Tagged<string, "pepsi">, unknown>,
    ),
  ).toEqualTypeOf<Tagged<string, "coke"> | Tagged<string, "pepsi">>();
});

test("union of branded keys", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      {} as Record<Tagged<string, "coke"> | Tagged<string, "pepsi">, unknown>,
    ),
  ).toEqualTypeOf<Tagged<string, "coke"> | Tagged<string, "pepsi">>();
});

test("union with a mix of branded and number keys", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      {} as Record<Tagged<string, "brand"> | number, unknown>,
    ),
  ).toEqualTypeOf<Tagged<string, "brand"> | `${number}`>();
});

test("union of records with branded key and number key", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      {} as Record<Tagged<string, "brand">, unknown> | Record<number, unknown>,
    ),
  ).toEqualTypeOf<Tagged<string, "brand"> | `${number}`>();
});

test("symbol keys", () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<string | symbol, unknown>),
  ).toEqualTypeOf<string>();

  expectTypeOf(
    enumerableStringKeyOf({ [SymbolFoo]: "hello", a: "world" }),
  ).toEqualTypeOf<"a">();

  expectTypeOf(
    enumerableStringKeyOf({} as Record<string | typeof SymbolFoo, unknown>),
  ).toEqualTypeOf<string>();
});

test("optional keys", () => {
  expectTypeOf(
    enumerableStringKeyOf({ a: "hello" } as { a: unknown; b?: unknown }),
  ).toEqualTypeOf<"a" | "b">();
});

test("branded types", () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<Tagged<string, "brand">, unknown>),
  ).toEqualTypeOf<Tagged<string, "brand">>();
});
