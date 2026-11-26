import { expectTypeOf, test } from "vitest";
import { uniqueWith } from "./uniqueWith";

test("array literals are inferred as tuples", () => {
  expectTypeOf(uniqueWith([1, 2], (a, b) => a === b)).toEqualTypeOf<
    [number, ...number[]]
  >();
});
