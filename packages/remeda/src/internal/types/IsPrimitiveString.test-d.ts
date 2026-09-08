import type { LiteralUnion } from "type-fest";
import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { IsPrimitiveString } from "./IsPrimitiveString";

declare function isPrimitiveString<T extends string>(
  data: T,
): IsPrimitiveString<T>;

test("actually primitive", () => {
  expectTypeOf(isPrimitiveString($typed<string>())).toEqualTypeOf<true>();
});

test("actually literal", () => {
  expectTypeOf(isPrimitiveString("abc")).toEqualTypeOf<false>();
});

test("template literal", () => {
  expectTypeOf(
    isPrimitiveString($typed<`${string}_${string}`>()),
  ).toEqualTypeOf<false>();
});

test("type-fest shenanigans", () => {
  expectTypeOf(
    isPrimitiveString($typed<LiteralUnion<"a" | "b", string>>()),
  ).toEqualTypeOf<true>();
});
