import { type Branded, type IfBoundedRecord } from "./types";

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
