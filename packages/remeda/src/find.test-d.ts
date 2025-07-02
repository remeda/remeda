import { expectTypeOf, test } from "vitest";
import { find } from "./find";
import { isString } from "./isString";

test("can narrow types", () => {
  const result = find([1, "a"], isString);

  expectTypeOf(result).toEqualTypeOf<string | undefined>();
});
