import { findLastIndex } from "./findLastIndex";
import { pipe } from "./pipe";

describe("data first", () => {
  test("findLastIndex", () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(2);
  });

  test("findLast first value", () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x === 1)).toBe(0);
  });

  test("findLastIndex -1", () => {
    expect(findLastIndex([1, 2, 3, 4], (x) => x === 5)).toBe(-1);
  });
});

describe("data last", () => {
  test("found", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLastIndex((x) => x % 2 === 1),
      ),
    ).toBe(2);
  });

  test("not found", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLastIndex((x) => x === 5),
      ),
    ).toBe(-1);
  });
});
