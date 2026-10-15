import { expectTypeOf, test } from "vitest";
import type { $missingPropertyType } from "./$missingPropertyType";

// `toEqualTypeOf` can't tell `missing` apart from `undefined`, so we detect it
// via a relation that treats them differently: TypeScript strips `missing` from
// an inferred optional tuple element, but not from an array's items.
type HasMissingItems<T> = T extends readonly [(infer _Head)?, ...unknown[]]
  ? false
  : true;

test("produces the `missing` type", () => {
  // Tests using the helper pass vacuously when it stops producing `missing`
  // (e.g., when its return type is made explicit, or when TypeScript changes
  // how it handles `missing`).
  expectTypeOf<
    HasMissingItems<ReturnType<typeof $missingPropertyType>>
  >().toEqualTypeOf<true>();
});

test("detection doesn't flag a regular `undefined`", () => {
  expectTypeOf<
    HasMissingItems<(string | undefined)[]>
  >().toEqualTypeOf<false>();
});
