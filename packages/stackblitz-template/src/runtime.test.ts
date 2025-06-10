import { add, map } from "remeda";

describe("runtime tests", () => {
  test("example", () => {
    expect(map([1, 2, 3], add(1))).toStrictEqual([2, 3, 4]);
  });
});
