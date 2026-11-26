import { expectTypeOf, test } from "vitest";
import { swapIndices } from "./swapIndices";

test("array literals are inferred as tuples", () => {
  expectTypeOf(swapIndices([1, "a"], 0, 1)).toEqualTypeOf<[string, number]>();
});
