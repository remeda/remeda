import { expectTypeOf, test } from "vitest";
import type { Not } from "./Not";
import { $typed } from "../../../test/$typed";

declare function not<T extends boolean>(data: T): Not<T>;

test("true", () => {
  expectTypeOf(not(true)).toEqualTypeOf<false>();
});

test("false", () => {
  expectTypeOf(not(false)).toEqualTypeOf<true>();
});

test("boolean", () => {
  expectTypeOf(not($typed<boolean>())).toEqualTypeOf<boolean>();
});
