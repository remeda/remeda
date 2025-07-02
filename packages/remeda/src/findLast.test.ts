import { describe, expect, test } from "vitest";
import { findLast } from "./findLast";
import { pipe } from "./pipe";

describe("data first", () => {
  test("findLast", () => {
    expect(findLast([1, 2, 3, 4], (x) => x % 2 === 1)).toBe(3);
  });

  test("indexed", () => {
    expect(findLast([1, 2, 3, 4], (x, i) => x === 3 && i === 2)).toBe(3);
  });

  test("findLast first value", () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 1)).toBe(1);
  });

  test("findLast no match", () => {
    expect(findLast([1, 2, 3, 4], (x) => x === 5)).toBeUndefined();
  });
});

describe("data last", () => {
  test("findLast", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x) => x % 2 === 1),
      ),
    ).toBe(3);
  });

  test("indexed", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        findLast((x, i) => x === 3 && i === 2),
      ),
    ).toBe(3);
  });
});
