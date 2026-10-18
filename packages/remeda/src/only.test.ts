import { describe, expect, test } from "vitest";
import { filter } from "./filter";
import { only } from "./only";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("empty array", () => {
    expect(only([])).toBeUndefined();
  });

  test("length 1 array", () => {
    expect(only([1])).toBe(1);
  });

  test("length 2 array", () => {
    expect(only([1, 2])).toBeUndefined();
  });

  test("length 3 array", () => {
    expect(only([1, 2, 3])).toBeUndefined();
  });

  test("returns the item itself", () => {
    const item = { a: 1 };

    expect(only([item])).toBe(item);
  });

  test("a NaN item", () => {
    expect(only([NaN])).toBeNaN();
  });

  test("a -0 item", () => {
    expect(only([-0])).toBe(-0);
  });

  test("an undefined first item still counts", () => {
    expect(only([undefined, 1])).toBeUndefined();
  });

  test("a hole counts as an item", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(only([, 1])).toBeUndefined();
  });
});

describe("data last", () => {
  test("empty array", () => {
    expect(pipe([], only())).toBeUndefined();
  });

  test("length 1 array", () => {
    expect(pipe([1], only())).toBe(1);
  });

  test("length 2 array", () => {
    expect(pipe([1, 2], only())).toBeUndefined();
  });

  test("length 3 array", () => {
    expect(pipe([1, 2, 3], only())).toBeUndefined();
  });

  test("an undefined first item still counts", () => {
    expect(pipe([undefined, 1], only())).toBeUndefined();
  });

  test("counts only the items that reach it", () => {
    expect(
      pipe(
        [1, 2, 3],
        filter((x) => x > 2),
        only(),
      ),
    ).toBe(3);
  });
});

test("simple tuple", () => {
  expect(only([1, "a"])).toBeUndefined();
});

test("tuple with last", () => {
  expect(only(["a", 1])).toBeUndefined();
});

test("tuple with two last", () => {
  expect(only(["a", 1, 2])).toBeUndefined();
});

test("tuple with first and last", () => {
  expect(only([1, "a", 2])).toBeUndefined();
});
