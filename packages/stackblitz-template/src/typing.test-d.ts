import { pick } from "remeda";

describe("type tests", () => {
  test("example", () => {
    expectTypeOf(pick({ a: 1, b: "hello" } as const, ["a"])).toEqualTypeOf<{
      readonly a: 1;
    }>();
  });
});
