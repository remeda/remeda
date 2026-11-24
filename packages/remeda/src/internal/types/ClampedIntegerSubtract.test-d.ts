import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { ClampedIntegerSubtract } from "./ClampedIntegerSubtract";

declare function clampedIntegerSubtract<
  Minuend extends number,
  Subtrahend extends number,
>(
  minuend: Minuend,
  subtrahend: Subtrahend,
): ClampedIntegerSubtract<Minuend, Subtrahend>;

test("single digits", () => {
  expectTypeOf(clampedIntegerSubtract(5, 3)).toEqualTypeOf<2>();
});

test("equal numbers", () => {
  expectTypeOf(clampedIntegerSubtract(42, 42)).toEqualTypeOf<0>();
});

test("smaller minuend", () => {
  expectTypeOf(clampedIntegerSubtract(3, 5)).toEqualTypeOf<0>();
});

test("subtrahend with more digits", () => {
  expectTypeOf(clampedIntegerSubtract(99, 100)).toEqualTypeOf<0>();
});

test("borrow across digits", () => {
  expectTypeOf(clampedIntegerSubtract(1000, 1)).toEqualTypeOf<999>();
});

test("operands of different lengths", () => {
  expectTypeOf(
    clampedIntegerSubtract(123_456_789, 98_765),
  ).toEqualTypeOf<123_358_024>();
});

test("union minuend", () => {
  expectTypeOf(clampedIntegerSubtract($typed<5 | 10>(), 3)).toEqualTypeOf<
    2 | 7
  >();
});

test("negative minuend", () => {
  expectTypeOf(clampedIntegerSubtract(-1, 2)).toEqualTypeOf<0>();
});

test("fractional minuend", () => {
  expectTypeOf(clampedIntegerSubtract(1.5, 1)).toEqualTypeOf<number>();
});

test("minuend printed with an exponent", () => {
  expectTypeOf(clampedIntegerSubtract(1e21, 1)).toEqualTypeOf<number>();
});

test("non-literal minuend", () => {
  expectTypeOf(
    clampedIntegerSubtract($typed<number>(), 1),
  ).toEqualTypeOf<number>();
});
