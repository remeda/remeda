import { expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";

test("acts as identity with 0 functions", () => {
  const data = { a: "hello", b: 123 };

  expectTypeOf(pipe(data)).toEqualTypeOf(data);
});
