import { expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { Not } from "./Not";

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
