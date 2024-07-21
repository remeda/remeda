import { type EmptyObject } from "type-fest";
import {
  type Branded,
  type IfBoundedRecord,
  type EnumerableStringKeyedValueOf,
  type EnumerableStringKeyOf,
  type NTuple,
} from "./types";

declare const SymbolFoo: unique symbol;
declare const SymbolBar: unique symbol;

describe("IfBoundedRecord", () => {
  test("string", () => {
    expectTypeOf<
      IfBoundedRecord<Record<string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<string, unknown>>>
    >().toEqualTypeOf<false>();
  });

  test("number", () => {
    expectTypeOf<
      IfBoundedRecord<Record<number, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<number, unknown>>>
    >().toEqualTypeOf<false>();
  });

  test("symbol", () => {
    expectTypeOf<
      IfBoundedRecord<Record<symbol, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<symbol, unknown>>>
    >().toEqualTypeOf<false>();
  });

  test("union of string, number, symbol", () => {
    expectTypeOf<
      IfBoundedRecord<Record<number | string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<string | symbol, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("string literals and their union", () => {
    expectTypeOf<IfBoundedRecord<Record<"a", unknown>>>().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<"a" | "b", unknown>>
    >().toEqualTypeOf<true>();
  });

  test("number literals and their union", () => {
    expectTypeOf<IfBoundedRecord<Record<1, unknown>>>().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<1 | 2, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("symbol literals and their union", () => {
    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolBar | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("unions between string, number, symbol", () => {
    expectTypeOf<
      IfBoundedRecord<Record<"a" | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo | "a", unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo | "a" | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<{ 1: number } | { a: string; [SymbolFoo]: number }>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<{ 1?: number } | { a?: string; [SymbolFoo]: number }>
    >().toEqualTypeOf<true>();
  });

  test("unions with unbounded types", () => {
    expectTypeOf<
      IfBoundedRecord<Record<number | "a", unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<string | 1, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<1, unknown> | Record<string, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("branded types", () => {
    expectTypeOf<
      IfBoundedRecord<Record<Branded<string, symbol>, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<Branded<number, symbol>, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("bounded template strings", () => {
    expectTypeOf<
      IfBoundedRecord<Record<`a_${1 | 2}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<`${"a" | "b"}_${1 | 2}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<
        Record<`${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`, unknown>
      >
    >().toEqualTypeOf<true>();
  });

  test("unbounded template strings", () => {
    expectTypeOf<
      IfBoundedRecord<Record<`a_${number}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<`${"a" | "b"}_${number}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<`a_${string}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<
        Record<`${string}_${number}_${string}_${number}_${string}`, unknown>
      >
    >().toEqualTypeOf<false>();
  });
});

describe("EnumerableStringKeyOf", () => {
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
      EnumerableStringKeyOf<Record<Branded<string, symbol>, unknown>>
    >().toEqualTypeOf<`${Branded<string, symbol>}`>();
  });
});

describe("EnumerableStringKeyedValueOf", () => {
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
      EnumerableStringKeyedValueOf<
        Record<PropertyKey | typeof SymbolFoo, string>
      >
    >().toEqualTypeOf<string>();
  });

  test("empty object", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<EmptyObject>
    >().toEqualTypeOf<never>();
  });
});

describe("NTuple", () => {
  test("size 0", () => {
    expectTypeOf<NTuple<string, 0>>().toEqualTypeOf<[]>();
  });

  test("simple size", () => {
    expectTypeOf<NTuple<string, 3>>().toEqualTypeOf<[string, string, string]>();
  });

  test("with prefix smaller than N", () => {
    expectTypeOf<NTuple<string, 3, [boolean]>>().toEqualTypeOf<
      [boolean, string, string]
    >();
  });

  test("with prefix equal to N", () => {
    expectTypeOf<
      NTuple<string, 3, [boolean, boolean, boolean]>
    >().toEqualTypeOf<[boolean, boolean, boolean]>();
  });

  describe("UNSUPPORTED CASES", () => {
    test("non-literal size", () => {
      // @ts-expect-error [ts2344] - We don't support non-literal sizes to reduce the load needed to compute it.
      expectTypeOf<NTuple<string, number>>().toEqualTypeOf<Array<string>>();
    });

    test("with prefix larger than N", () => {
      expectTypeOf<
        // @ts-expect-error [ts2589] - This case causes an infinite loop
        NTuple<string, 1, [boolean, boolean, boolean]>
      >().toEqualTypeOf<[]>();
    });
  });
});
