import { describe, expect, test } from "vitest";
import { includesAny } from "./includesAny";
import { pipe } from "./pipe";

describe("data first", () => {
  test("should return true when any candidate is found", () => {
    expect(includesAny([1, 2, 3], [2, 4])).toBe(true);
  });

  test("should return false when no candidates are found", () => {
    expect(includesAny([1, 2, 3], [4, 5])).toBe(false);
  });

  test("should work with strings", () => {
    expect(includesAny(["a", "b", "c"], ["b", "d"])).toBe(true);
    expect(includesAny(["a", "b", "c"], ["d", "e"])).toBe(false);
  });

  test("should work with empty arrays", () => {
    expect(includesAny([], [1, 2])).toBe(false);
    expect(includesAny([1, 2], [])).toBe(false);
    expect(includesAny([], [])).toBe(false);
  });

  test("should return true when multiple candidates are found", () => {
    expect(includesAny([1, 2, 3, 4], [2, 3])).toBe(true);
  });

  test("should work with mixed types", () => {
    expect(includesAny([1, "a", true] as Array<string | number | boolean>, ["a", false])).toBe(true);
    expect(includesAny([1, "a", true] as Array<string | number | boolean>, [2, false])).toBe(false);
  });

  test("should use reference equality", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 1 }; // different reference but same content

    expect(includesAny([obj1, obj2], [obj1])).toBe(true);
    expect(includesAny([obj1, obj2], [obj3])).toBe(false);
  });
});

describe("data last", () => {
  test("should return true when any candidate is found", () => {
    expect(pipe([1, 2, 3], includesAny([2, 4]))).toBe(true);
  });

  test("should return false when no candidates are found", () => {
    expect(pipe([1, 2, 3], includesAny([4, 5]))).toBe(false);
  });

  test("should work with strings", () => {
    expect(pipe(["a", "b", "c"], includesAny(["b", "d"]))).toBe(true);
    expect(pipe(["a", "b", "c"], includesAny(["d", "e"]))).toBe(false);
  });

  test("should work with empty arrays", () => {
    expect(pipe([], includesAny([1, 2]))).toBe(false);
    expect(pipe([1, 2], includesAny([]))).toBe(false);
    expect(pipe([], includesAny([]))).toBe(false);
  });

  test("should return true when multiple candidates are found", () => {
    expect(pipe([1, 2, 3, 4], includesAny([2, 3]))).toBe(true);
  });

  test("should work with mixed types", () => {
    expect(pipe([1, "a", true] as Array<string | number | boolean>, includesAny(["a", false]))).toBe(true);
    expect(pipe([1, "a", true] as Array<string | number | boolean>, includesAny([2, false]))).toBe(false);
  });

  test("should use reference equality", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 1 }; // different reference but same content

    expect(pipe([obj1, obj2], includesAny([obj1]))).toBe(true);
    expect(pipe([obj1, obj2], includesAny([obj3]))).toBe(false);
  });
});