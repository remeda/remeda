import type { EmptyObject } from "type-fest";
import type { EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf";

declare const SymbolFoo: unique symbol;

test("string values", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<Record<PropertyKey, string>>
  >().toEqualTypeOf<string>();
});

test("number values", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<Record<PropertyKey, number>>
  >().toEqualTypeOf<number>();
});

test("union of records", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<
      Record<PropertyKey, "cat"> | Record<PropertyKey, "dog">
    >
  >().toEqualTypeOf<"cat" | "dog">();

  expectTypeOf<
    EnumerableStringKeyedValueOf<
      Record<PropertyKey, number> | Record<PropertyKey, string>
    >
  >().toEqualTypeOf<number | string>();
});

test("union values", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<Record<PropertyKey, number | string>>
  >().toEqualTypeOf<number | string>();
});

test("literal values", () => {
  expectTypeOf<EnumerableStringKeyedValueOf<{ a: 1 }>>().toEqualTypeOf<1>();

  expectTypeOf<
    EnumerableStringKeyedValueOf<{ a: "1" | "2" | 1 }>
  >().toEqualTypeOf<"1" | "2" | 1>();
});

test("optional values", () => {
  expectTypeOf<EnumerableStringKeyedValueOf<{ a: 1; b?: 4 }>>().toEqualTypeOf<
    1 | 4
  >();

  expectTypeOf<
    EnumerableStringKeyedValueOf<{ a: string; b?: number }>
  >().toEqualTypeOf<number | string>();
});

test("nullish and undefined values", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<{
      a: string | undefined;
      b: string | null;
    }>
  >().toEqualTypeOf<string | null | undefined>();

  expectTypeOf<
    EnumerableStringKeyedValueOf<{
      a?: number | null;
      b?: number | null | undefined;
    }>
  >().toEqualTypeOf<number | null | undefined>();
});

test("symbol keys", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<{ [SymbolFoo]: string }>
  >().toEqualTypeOf<never>();

  expectTypeOf<
    EnumerableStringKeyedValueOf<{ [SymbolFoo]: string; b: "1" }>
  >().toEqualTypeOf<"1">();

  expectTypeOf<
    EnumerableStringKeyedValueOf<Record<PropertyKey | typeof SymbolFoo, string>>
  >().toEqualTypeOf<string>();
});

test("empty object", () => {
  expectTypeOf<
    EnumerableStringKeyedValueOf<EmptyObject>
  >().toEqualTypeOf<never>();
});
