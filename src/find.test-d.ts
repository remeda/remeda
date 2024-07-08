import { find } from "./find";
import { isString } from "./isString";

describe("typing", () => {
  test("can narrow types", () => {
    const result = find([1, "a"], isString);
    expectTypeOf(result).toEqualTypeOf<string | undefined>();
  });
});
