import type { Tagged } from "type-fest";
import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { EnumerableStringKeyOf } from "./EnumerableStringKeyOf";

declare const SYMBOL: unique symbol;

declare function enumerableStringKeyOf<T>(data: T): EnumerableStringKeyOf<T>;

test("string keys", () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<Record<string, unknown>>()),
  ).toEqualTypeOf<string>();
});

test("number keys", () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<Record<number, unknown>>()),
  ).toEqualTypeOf<`${number}`>();
});

test("union of records", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<Record<`prefix_${string}`, unknown> | Record<number, unknown>>(),
    ),
  ).toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

test("union keys", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<Record<number | `prefix_${string}`, unknown>>(),
    ),
  ).toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

test("union of records with branded keys", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<
        | Record<Tagged<string, "coke">, unknown>
        | Record<Tagged<string, "pepsi">, unknown>
      >(),
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
      $typed<Record<Tagged<string, "brand"> | number, unknown>>(),
    ),
  ).toEqualTypeOf<Tagged<string, "brand"> | `${number}`>();
});

test("union of records with branded key and number key", () => {
  expectTypeOf(
    enumerableStringKeyOf(
      $typed<
        Record<Tagged<string, "brand">, unknown> | Record<number, unknown>
      >(),
    ),
  ).toEqualTypeOf<Tagged<string, "brand"> | `${number}`>();
});

test("symbol keys", () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<Record<string | symbol, unknown>>()),
  ).toEqualTypeOf<string>();

  expectTypeOf(
    enumerableStringKeyOf({ [SYMBOL]: "hello", a: "world" }),
  ).toEqualTypeOf<"a">();

  expectTypeOf(
    enumerableStringKeyOf({} as Record<string | typeof SYMBOL, unknown>),
  ).toEqualTypeOf<string>();
});

test("optional keys", () => {
  expectTypeOf(
    enumerableStringKeyOf($typed<{ a: unknown; b?: unknown }>()),
  ).toEqualTypeOf<"a" | "b">();
});

test("branded types", () => {
  expectTypeOf(
    enumerableStringKeyOf({} as Record<Tagged<string, "brand">, unknown>),
  ).toEqualTypeOf<Tagged<string, "brand">>();
});
