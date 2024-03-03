import { isTruthy } from "./isTruthy";

describe("isTruthy", () => {
  test("isTruthy", () => {
    const data: "" | 0 | false | { a: string } = { a: "asd" };
    if (isTruthy(data)) {
      expect(data).toEqual({ a: "asd" });
      assertType<{ a: string }>(data);
    }
  });
});
