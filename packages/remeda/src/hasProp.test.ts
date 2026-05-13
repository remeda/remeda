import { describe, expect, test } from "vitest";
import { hasProp } from "./hasProp";
import { pipe } from "./pipe";

test("returns true for an own property", () => {
  expect(hasProp({ a: 1 }, "a")).toBe(true);
});

test("returns true for an own property whose value is undefined", () => {
  expect(hasProp({ a: undefined }, "a")).toBe(true);
});

test("returns false for a missing optional property", () => {
  expect(hasProp({} as { a?: number }, "a")).toBe(false);
});

test("returns false for inherited prototype properties", () => {
  expect(hasProp({} as Record<string, unknown>, "toString")).toBe(false);
});

test("returns false for properties only on a custom prototype", () => {
  expect(
    hasProp(
      Object.create({ inherited: 1 }) as Record<string, unknown>,
      "inherited",
    ),
  ).toBe(false);
});

test("returns true for own properties on a null-prototype object", () => {
  expect(
    hasProp(
      Object.assign(Object.create(null) as Record<string, unknown>, { a: 1 }),
      "a",
    ),
  ).toBe(true);
});

test("returns true for own symbol keys", () => {
  const symbol = Symbol("test");

  expect(hasProp({ [symbol]: 1 }, symbol)).toBe(true);
});

test("returns true for numeric keys", () => {
  expect(hasProp({ 0: "a" }, 0)).toBe(true);
});

describe("arrays", () => {
  test("returns true for an array index that exists", () => {
    expect(hasProp([1, 2, 3], 1)).toBe(true);
  });

  test("returns false for an array index past the end", () => {
    expect(hasProp([1, 2, 3], 5)).toBe(false);
  });

  test("returns true for the array length own property", () => {
    expect(hasProp([1, 2, 3], "length")).toBe(true);
  });

  test("returns false for inherited array members", () => {
    expect(hasProp([1, 2, 3], "push")).toBe(false);
  });
});

describe("data-last", () => {
  test("returns true for an own property", () => {
    expect(pipe({ a: 1 }, hasProp("a"))).toBe(true);
  });

  test("returns false for a missing optional property", () => {
    expect(pipe({} as { a?: number }, hasProp("a"))).toBe(false);
  });

  test("returns true for an own property whose value is undefined", () => {
    expect(pipe({ a: undefined }, hasProp("a"))).toBe(true);
  });

  test("returns false for inherited prototype properties", () => {
    expect(pipe({} as Record<string, unknown>, hasProp("toString"))).toBe(
      false,
    );
  });
});
