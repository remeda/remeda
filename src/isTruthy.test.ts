import { isTruthy } from "./isTruthy";

describe("isTruthy", () => {
  test("isTruthy", () => {
    const data: "" | 0 | false | { a: string } = { a: "asd" };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: "asd" });
      expectTypeOf(data).toEqualTypeOf<{ a: string }>();
    }
  });
});
