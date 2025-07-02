import { expectTypeOf, it } from "vitest";
import { pipe } from "./pipe";

it("acts as identity with 0 functions", () => {
  const data = { a: "hello", b: 123 };

  expectTypeOf(pipe(data)).toEqualTypeOf(data);
});
