import { describe, expect, test } from "vitest";
import { last } from "./last";
import { pipe } from "./pipe";

describe("data first", () => {
  test("should return last", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  test("empty array", () => {
    expect(last([])).toBeUndefined();
  });
});

describe("data last", () => {
  test("should return last", () => {
    expect(pipe([1, 2, 3], last())).toBe(3);
  });

  test("empty array", () => {
    expect(pipe([], last())).toBeUndefined();
  });
});
