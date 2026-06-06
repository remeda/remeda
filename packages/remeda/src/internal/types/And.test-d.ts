import { expectTypeOf, test } from "vitest";
import type { And } from "./And";

test("truth table", () => {
  expectTypeOf<And<[true, true]>>().toEqualTypeOf<true>();
  expectTypeOf<And<[true, false]>>().toEqualTypeOf<false>();
  expectTypeOf<And<[false, true]>>().toEqualTypeOf<false>();
  expectTypeOf<And<[false, false]>>().toEqualTypeOf<false>();
});

test("variadic", () => {
  expectTypeOf<And<[]>>().toEqualTypeOf<true>();
  expectTypeOf<And<[false]>>().toEqualTypeOf<false>();
  expectTypeOf<And<[true, true, true]>>().toEqualTypeOf<true>();
  expectTypeOf<And<[true, true, false, true]>>().toEqualTypeOf<false>();
});

test("distributes over boolean", () => {
  expectTypeOf<And<[boolean, true]>>().toEqualTypeOf<boolean>();
  expectTypeOf<And<[true, boolean]>>().toEqualTypeOf<boolean>();
  expectTypeOf<And<[boolean, boolean]>>().toEqualTypeOf<boolean>();
  expectTypeOf<And<[false, boolean]>>().toEqualTypeOf<false>();
  expectTypeOf<And<[boolean, false]>>().toEqualTypeOf<false>();
});

test("treats any as boolean", () => {
  /* eslint-disable @typescript-eslint/no-explicit-any -- `any` is the operand under test here; we're asserting how `And` collapses it. */
  expectTypeOf<And<[true, any]>>().toEqualTypeOf<boolean>();
  expectTypeOf<And<[false, any]>>().toEqualTypeOf<false>();
  /* eslint-enable @typescript-eslint/no-explicit-any */
});
