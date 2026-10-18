import { describe, expect, test } from "vitest";
import { filter } from "./filter";
import { hasAtLeast } from "./hasAtLeast";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("works on empty arrays", () => {
    expect(hasAtLeast([], 0)).toBe(true);
    expect(hasAtLeast([], 10)).toBe(false);
  });

  test("works on single item arrays", () => {
    expect(hasAtLeast([1], 0)).toBe(true);
    expect(hasAtLeast([1], 1)).toBe(true);
    expect(hasAtLeast([1], 2)).toBe(false);
  });

  test("works on large arrays", () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);

    expect(hasAtLeast(array, 0)).toBe(true);
    expect(hasAtLeast(array, 1)).toBe(true);
    expect(hasAtLeast(array, 1000)).toBe(true);
    expect(hasAtLeast(array, 1001)).toBe(false);
  });

  test("works on sparse arrays", () => {
    const array = Array.from({ length: 1000 });

    expect(hasAtLeast(array, 0)).toBe(true);
    expect(hasAtLeast(array, 1)).toBe(true);
    expect(hasAtLeast(array, 1000)).toBe(true);
    expect(hasAtLeast(array, 1001)).toBe(false);
  });

  test("counts holes", () => {
    // eslint-disable-next-line no-sparse-arrays -- The holes are the case under test.
    expect(hasAtLeast([, , ,], 3)).toBe(true);
  });

  test("a fractional minimum above the length", () => {
    expect(hasAtLeast([1, 2], 2.5)).toBe(false);
  });

  test("a fractional minimum below the length", () => {
    expect(hasAtLeast([1, 2, 3], 2.5)).toBe(true);
  });

  test("a NaN minimum is never met", () => {
    expect(hasAtLeast([1, 2, 3], NaN)).toBe(false);
  });

  test("a NaN minimum is never met, even on an empty array", () => {
    expect(hasAtLeast([], NaN)).toBe(false);
  });

  test("a negative minimum is met by an empty array", () => {
    expect(hasAtLeast([], -1)).toBe(true);
  });

  test("an infinite minimum is never met", () => {
    expect(hasAtLeast([1, 2, 3], Infinity)).toBe(false);
  });
});

describe("dataLast", () => {
  test("works on empty arrays", () => {
    expect(hasAtLeast(0)([])).toBe(true);
    expect(hasAtLeast(10)([])).toBe(false);
  });

  test("works on single item arrays", () => {
    expect(hasAtLeast(0)([1])).toBe(true);
    expect(hasAtLeast(1)([1])).toBe(true);
    expect(hasAtLeast(2)([1])).toBe(false);
  });

  test("works on large arrays", () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);

    expect(hasAtLeast(0)(array)).toBe(true);
    expect(hasAtLeast(1)(array)).toBe(true);
    expect(hasAtLeast(1000)(array)).toBe(true);
    expect(hasAtLeast(1001)(array)).toBe(false);
  });

  test("works on sparse arrays", () => {
    const array = Array.from({ length: 1000 });

    expect(hasAtLeast(0)(array)).toBe(true);
    expect(hasAtLeast(1)(array)).toBe(true);
    expect(hasAtLeast(1000)(array)).toBe(true);
    expect(hasAtLeast(1001)(array)).toBe(false);
  });

  describe("in a pipe", () => {
    test("a zero minimum is met by an empty array", () => {
      expect(pipe([], hasAtLeast(0))).toBe(true);
    });

    test("a positive minimum isn't met by an empty array", () => {
      expect(pipe([], hasAtLeast(1))).toBe(false);
    });

    test("a negative minimum is met by an empty array", () => {
      expect(pipe([], hasAtLeast(-1))).toBe(true);
    });

    test("a NaN minimum is never met, even on an empty array", () => {
      expect(pipe([], hasAtLeast(NaN))).toBe(false);
    });

    test("a NaN minimum is never met", () => {
      expect(pipe([1, 2, 3], hasAtLeast(NaN))).toBe(false);
    });

    test("a fractional minimum above the length", () => {
      expect(pipe([1, 2], hasAtLeast(2.5))).toBe(false);
    });

    test("a fractional minimum below the length", () => {
      expect(pipe([1, 2, 3], hasAtLeast(2.5))).toBe(true);
    });

    test("counts only the items that reach it", () => {
      expect(
        pipe(
          [1, 2, 3, 4],
          filter((x) => x % 2 === 0),
          hasAtLeast(3),
        ),
      ).toBe(false);
    });

    test("as a filter predicate", () => {
      expect(pipe([[1, 2], [3], [4, 5]], filter(hasAtLeast(2)))).toStrictEqual([
        [1, 2],
        [4, 5],
      ]);
    });
  });
});
