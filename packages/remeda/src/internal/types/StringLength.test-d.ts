import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { StringLength } from "./StringLength";

declare function stringLength<S extends string>(data: S): StringLength<S>;

test("empty string", () => {
  expectTypeOf(stringLength("")).toEqualTypeOf<0>();
});

test("simple string", () => {
  expectTypeOf(stringLength("hello")).toEqualTypeOf<5>();
});

test("union of simple strings", () => {
  expectTypeOf(stringLength("hello" as "cat" | "elephant")).toEqualTypeOf<
    3 | 8
  >();
});

test("primitive string", () => {
  expectTypeOf(stringLength($typed<string>())).toEqualTypeOf<number>();
});

test("bounded template string", () => {
  expectTypeOf(stringLength($typed<`h${1 | 22 | 333}`>())).toEqualTypeOf<
    2 | 3 | 4
  >();
});

test("unbounded template string", () => {
  expectTypeOf(stringLength($typed<`h${string}`>())).toEqualTypeOf<number>();
});

test("union of bounded and unbounded string", () => {
  expectTypeOf(
    stringLength($typed<`h${1 | 22 | 333}` | `h${string}`>()),
  ).toEqualTypeOf<number>();
});
