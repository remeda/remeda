import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { WidePropertyKey } from "./WidePropertyKey";

enum NumericEnum {
  A = 0,
  B = 1,
}

declare const UNIQUE_SYMBOL: unique symbol;

declare function widePropertyKey<Key extends PropertyKey>(
  key: Key,
): WidePropertyKey<Key>;

test("string", () => {
  expectTypeOf(widePropertyKey($typed<string>())).toEqualTypeOf<string>();
});

test("number", () => {
  expectTypeOf(widePropertyKey($typed<number>())).toEqualTypeOf<number>();
});

test("symbol", () => {
  expectTypeOf(widePropertyKey($typed<symbol>())).toEqualTypeOf<symbol>();
});

test("literal", () => {
  expectTypeOf(widePropertyKey("a")).toBeNever();
});

test("union of literals", () => {
  expectTypeOf(widePropertyKey($typed<"a" | 1>())).toBeNever();
});

test("template literal", () => {
  expectTypeOf(widePropertyKey($typed<`data-${string}`>())).toBeNever();
});

test("wide key in a union", () => {
  expectTypeOf(widePropertyKey($typed<"a" | number>())).toEqualTypeOf<number>();
});

test("numeric enum", () => {
  expectTypeOf(widePropertyKey($typed<NumericEnum>())).toEqualTypeOf<number>();
});

test("unique symbol", () => {
  expectTypeOf(widePropertyKey(UNIQUE_SYMBOL)).toBeNever();
});

test("string takes precedence", () => {
  expectTypeOf(
    widePropertyKey($typed<number | string>()),
  ).toEqualTypeOf<string>();
});
