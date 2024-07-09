import { reverse } from "./reverse";
import { pipe } from "./pipe";

describe("data first", () => {
  test("reverse", () => {
    const actual = reverse([1, 2, 3]);
    expect(actual).toEqual([3, 2, 1]);
  });
});

describe("data last", () => {
  test("reverse", () => {
    const actual = pipe([1, 2, 3], reverse());
    expect(actual).toEqual([3, 2, 1]);
  });
});
