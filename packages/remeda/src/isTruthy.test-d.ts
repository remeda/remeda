import { expectTypeOf, test } from "vitest";
import { isTruthy } from "./isTruthy";

test("isTruthy", () => {
  const data: "" | 0 | false | { a: string } = { a: "asd" };
  if (isTruthy(data)) {
    expectTypeOf(data).toEqualTypeOf<{ a: string }>();
  }
});
