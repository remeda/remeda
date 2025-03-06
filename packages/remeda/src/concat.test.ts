import { concat } from "./concat";
import { pipe } from "./pipe";

describe("data first", () => {
  test("concat", () => {
    const actual = concat([1, 2, 3] as const, ["a"] as const);

    expect(actual).toStrictEqual([1, 2, 3, "a"] as const);
  });
});

describe("data last", () => {
  test("concat", () => {
    const actual = pipe([1, 2, 3] as const, concat(["a"] as const));

    expect(actual).toStrictEqual([1, 2, 3, "a"]);
  });
});
