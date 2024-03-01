import { isTruthy } from "./isTruthy";

describe("isTruthy", () => {
  test("isTruthy", () => {
    const data: false | "" | 0 | { a: string } = { a: "asd" };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: "asd" });
      assertType<{ a: string }>(data);
    }
  });
});
