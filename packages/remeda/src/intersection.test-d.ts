import { expectTypeOf, test } from "vitest";
import { intersection } from "./intersection";

test("narrows the result type", () => {
  const result = intersection([1, 2, 3, "a", "b"], ["a", "b", true, false]);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});
