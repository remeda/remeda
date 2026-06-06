import { expectTypeOf, test } from "vitest";
import type { Or } from "./Or";

test("truth table", () => {
  expectTypeOf<Or<[true, true]>>().toEqualTypeOf<true>();
  expectTypeOf<Or<[true, false]>>().toEqualTypeOf<true>();
  expectTypeOf<Or<[false, true]>>().toEqualTypeOf<true>();
  expectTypeOf<Or<[false, false]>>().toEqualTypeOf<false>();
});

test("variadic", () => {
  expectTypeOf<Or<[]>>().toEqualTypeOf<false>();
  expectTypeOf<Or<[true]>>().toEqualTypeOf<true>();
  expectTypeOf<Or<[false, false, false]>>().toEqualTypeOf<false>();
  expectTypeOf<Or<[false, false, true, false]>>().toEqualTypeOf<true>();
});

test("distributes over boolean", () => {
  expectTypeOf<Or<[boolean, false]>>().toEqualTypeOf<boolean>();
  expectTypeOf<Or<[false, boolean]>>().toEqualTypeOf<boolean>();
  expectTypeOf<Or<[boolean, boolean]>>().toEqualTypeOf<boolean>();
  expectTypeOf<Or<[true, boolean]>>().toEqualTypeOf<true>();
  expectTypeOf<Or<[boolean, true]>>().toEqualTypeOf<true>();
});

test("treats any as boolean", () => {
  /* eslint-disable @typescript-eslint/no-explicit-any -- `any` is the operand under test here; we're asserting how `Or` collapses it. */
  expectTypeOf<Or<[false, any]>>().toEqualTypeOf<boolean>();
  expectTypeOf<Or<[true, any]>>().toEqualTypeOf<true>();
  /* eslint-enable @typescript-eslint/no-explicit-any */
});
