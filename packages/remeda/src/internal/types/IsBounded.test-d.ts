import type { Tagged } from "type-fest";
import { expectTypeOf, test } from "vitest";
import type { IsBounded } from "./IsBounded";

declare const SymbolFoo: unique symbol;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const SymbolBar: unique symbol;

declare function isBounded<T>(data: T): IsBounded<T>;

test("string", () => {
  expectTypeOf(isBounded("")).toEqualTypeOf<false>();
});

test("number", () => {
  expectTypeOf(isBounded(1)).toEqualTypeOf<false>();
});

test("symbol", () => {
  expectTypeOf(isBounded(SymbolFoo as symbol)).toEqualTypeOf<false>();
});

test("union of string, number, symbol", () => {
  expectTypeOf(isBounded("" as string | number)).toEqualTypeOf<false>();
  expectTypeOf(isBounded("" as string | symbol)).toEqualTypeOf<false>();
});

test("string literals and their union", () => {
  expectTypeOf(isBounded("a" as const)).toEqualTypeOf<true>();
  expectTypeOf(isBounded("a" as "a" | "b")).toEqualTypeOf<true>();
});

test("number literals and their union", () => {
  expectTypeOf(isBounded(1 as const)).toEqualTypeOf<true>();
  expectTypeOf(isBounded(1 as 1 | 2)).toEqualTypeOf<true>();
});

test("symbol literals and their union", () => {
  expectTypeOf(isBounded(SymbolFoo)).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded(SymbolFoo as typeof SymbolFoo | typeof SymbolBar),
  ).toEqualTypeOf<true>();
});

test("unions between string, number, symbol", () => {
  expectTypeOf(isBounded("a" as "a" | 1)).toEqualTypeOf<true>();
  expectTypeOf(isBounded("a" as "a" | typeof SymbolFoo)).toEqualTypeOf<true>();
  expectTypeOf(isBounded(1 as 1 | typeof SymbolFoo)).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded("a" as "a" | 1 | typeof SymbolFoo),
  ).toEqualTypeOf<true>();
});

test("unions with unbounded types", () => {
  expectTypeOf(isBounded("a" as "a" | number)).toEqualTypeOf<false>();
  expectTypeOf(isBounded(1 as 1 | string)).toEqualTypeOf<false>();
});

test("branded types", () => {
  expectTypeOf(isBounded("" as Tagged<string, symbol>)).toEqualTypeOf<false>();
  expectTypeOf(isBounded(1 as Tagged<number, symbol>)).toEqualTypeOf<false>();
});

test("bounded template strings", () => {
  expectTypeOf(isBounded("a_1" as `a_${1 | 2}`)).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded("a_1" as `${"a" | "b"}_${1 | 2}`),
  ).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded("1_1_1_1_1" as `${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`),
  ).toEqualTypeOf<true>();
});

test("unbounded template strings", () => {
  expectTypeOf(isBounded("a_1" as `a_${number}`)).toEqualTypeOf<false>();
  expectTypeOf(
    isBounded("a_1" as `${"a" | "b"}_${number}`),
  ).toEqualTypeOf<false>();
  expectTypeOf(isBounded("a_hello" as `a_${string}`)).toEqualTypeOf<false>();
  expectTypeOf(
    isBounded(
      "a_1_b_2_c" as `${string}_${number}_${string}_${number}_${string}`,
    ),
  ).toEqualTypeOf<false>();
});
