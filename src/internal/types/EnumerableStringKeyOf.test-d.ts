import type { Tagged } from "type-fest";
import type { EnumerableStringKeyOf } from "./EnumerableStringKeyOf";

declare const SymbolFoo: unique symbol;

test("string keys", () => {
  expectTypeOf<
    EnumerableStringKeyOf<Record<string, unknown>>
  >().toEqualTypeOf<string>();
});

test("number keys", () => {
  expectTypeOf<
    EnumerableStringKeyOf<Record<number, unknown>>
  >().toEqualTypeOf<`${number}`>();
});

test("union of records", () => {
  expectTypeOf<
    EnumerableStringKeyOf<
      Record<`prefix_${string}`, unknown> | Record<number, unknown>
    >
  >().toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

test("union keys", () => {
  expectTypeOf<
    EnumerableStringKeyOf<Record<number | `prefix_${string}`, unknown>>
  >().toEqualTypeOf<`${number}` | `prefix_${string}`>();
});

test("symbol keys", () => {
  expectTypeOf<
    EnumerableStringKeyOf<Record<string | symbol, unknown>>
  >().toEqualTypeOf<string>();

  expectTypeOf<
    EnumerableStringKeyOf<{ [SymbolFoo]: number; a: unknown }>
  >().toEqualTypeOf<"a">();

  expectTypeOf<
    EnumerableStringKeyOf<Record<string | typeof SymbolFoo, unknown>>
  >().toEqualTypeOf<string>();
});

test("optional keys", () => {
  expectTypeOf<
    EnumerableStringKeyOf<{ a: unknown; b?: unknown }>
  >().toEqualTypeOf<"a" | "b">();
});

test("branded types", () => {
  expectTypeOf<
    EnumerableStringKeyOf<Record<Tagged<string, symbol>, unknown>>
  >().toEqualTypeOf<`${Tagged<string, symbol>}`>();
});
