import { expectTypeOf, test } from "vitest";
import { unique } from "./unique";

test("array literals are inferred as tuples", () => {
  expectTypeOf(unique([1, 2])).toEqualTypeOf<[number, ...number[]]>();
});
