import { describe, expect, test } from "vitest";
import { filter } from "./filter";
import { hasKey } from "./hasKey";
import { pipe } from "./pipe";

test("returns true for an own property", () => {
  expect(hasKey({ a: 1 }, "a")).toBe(true);
});

test("returns true for an own property whose value is undefined", () => {
  expect(hasKey({ a: undefined }, "a")).toBe(true);
});

test("returns false for a missing optional property", () => {
  expect(hasKey({} as { a?: number }, "a")).toBe(false);
});

test("returns false for inherited prototype properties", () => {
  expect(hasKey({} as Record<string, unknown>, "toString")).toBe(false);
});

test("returns false for properties only on a custom prototype", () => {
  expect(
    hasKey(
      Object.create({ inherited: 1 }) as Record<string, unknown>,
      "inherited",
    ),
  ).toBe(false);
});

test("returns true for own properties on a null-prototype object", () => {
  expect(
    hasKey(
      Object.assign(Object.create(null) as Record<string, unknown>, { a: 1 }),
      "a",
    ),
  ).toBe(true);
});

test("returns true for own symbol keys", () => {
  const symbol = Symbol("test");

  expect(hasKey({ [symbol]: 1 } as Record<symbol, unknown>, symbol)).toBe(true);
});

test("returns true for numeric keys", () => {
  expect(hasKey({ 0: "a" } as Record<number, unknown>, 0)).toBe(true);
});

describe("arrays", () => {
  test("returns true for an array index that exists", () => {
    expect(hasKey([1, 2, 3] as number[], 1)).toBe(true);
  });

  test("returns false for an array index past the end", () => {
    expect(hasKey([1, 2, 3] as number[], 5)).toBe(false);
  });
});

describe("data-last", () => {
  test("returns true for an own property", () => {
    expect(pipe({ a: 1 }, hasKey("a"))).toBe(true);
  });

  test("returns false for a missing optional property", () => {
    expect(pipe({} as { a?: number }, hasKey("a"))).toBe(false);
  });

  test("returns true for an own property whose value is undefined", () => {
    expect(pipe({ a: undefined }, hasKey("a"))).toBe(true);
  });

  test("returns false for inherited prototype properties", () => {
    expect(pipe({} as Record<string, unknown>, hasKey("toString"))).toBe(false);
  });

  test("filters and narrows union members", () => {
    const data = [{ a: 1 }, { b: 2 }] as { a?: number; b?: number }[];

    expect(filter(data, hasKey("a"))).toStrictEqual([{ a: 1 }]);
  });
});
