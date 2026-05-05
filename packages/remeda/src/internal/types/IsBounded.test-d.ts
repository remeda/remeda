import type { Tagged } from "type-fest";
import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { IsBounded } from "./IsBounded";

declare const SYMBOL_A: unique symbol;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const SYMBOL_B: unique symbol;

declare function isBounded<T>(data: T): IsBounded<T>;

test("string", () => {
  expectTypeOf(isBounded("")).toEqualTypeOf<false>();
});

test("number", () => {
  expectTypeOf(isBounded(1)).toEqualTypeOf<false>();
});

test("symbol", () => {
  expectTypeOf(isBounded(Symbol(""))).toEqualTypeOf<false>();
});

test("union of string, number, symbol", () => {
  expectTypeOf(isBounded($typed<string | number>())).toEqualTypeOf<false>();
  expectTypeOf(isBounded($typed<string | symbol>())).toEqualTypeOf<false>();
});

test("string literals and their union", () => {
  expectTypeOf(isBounded("a" as const)).toEqualTypeOf<true>();
  expectTypeOf(isBounded($typed<"a" | "b">())).toEqualTypeOf<true>();
});

test("number literals and their union", () => {
  expectTypeOf(isBounded(1 as const)).toEqualTypeOf<true>();
  expectTypeOf(isBounded($typed<1 | 2>())).toEqualTypeOf<true>();
});

test("symbol literals and their union", () => {
  expectTypeOf(isBounded(SYMBOL_A)).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded(SYMBOL_A as typeof SYMBOL_A | typeof SYMBOL_B),
  ).toEqualTypeOf<true>();
});

test("unions between string, number, symbol", () => {
  expectTypeOf(isBounded($typed<"a" | 1>())).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<"a" | typeof SYMBOL_A>()),
  ).toEqualTypeOf<true>();
  expectTypeOf(isBounded($typed<1 | typeof SYMBOL_A>())).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<"a" | 1 | typeof SYMBOL_A>()),
  ).toEqualTypeOf<true>();
});

test("unions with unbounded types", () => {
  expectTypeOf(isBounded($typed<"a" | number>())).toEqualTypeOf<false>();
  expectTypeOf(isBounded($typed<1 | string>())).toEqualTypeOf<false>();
});

test("branded types", () => {
  expectTypeOf(isBounded("" as Tagged<string, symbol>)).toEqualTypeOf<false>();
  expectTypeOf(isBounded(1 as Tagged<number, symbol>)).toEqualTypeOf<false>();
});

test("bounded template strings", () => {
  expectTypeOf(isBounded($typed<`a_${1 | 2}`>())).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<`${"a" | "b"}_${1 | 2}`>()),
  ).toEqualTypeOf<true>();
  expectTypeOf(
    isBounded($typed<`${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`>()),
  ).toEqualTypeOf<true>();
});

test("unbounded template strings", () => {
  expectTypeOf(isBounded($typed<`a_${number}`>())).toEqualTypeOf<false>();
  expectTypeOf(
    isBounded($typed<`${"a" | "b"}_${number}`>()),
  ).toEqualTypeOf<false>();
  expectTypeOf(isBounded($typed<`a_${string}`>())).toEqualTypeOf<false>();
  expectTypeOf(
    isBounded($typed<`${string}_${number}_${string}_${number}_${string}`>()),
  ).toEqualTypeOf<false>();
});
