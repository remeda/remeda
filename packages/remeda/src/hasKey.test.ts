import { describe, expect, test } from "vitest";
import { hasKey } from "./hasKey";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("returns true for an own property", () => {
    expect(hasKey({ a: 1 }, "a")).toBe(true);
  });

  test("returns false for a missing property", () => {
    expect(hasKey({ a: 1 }, "b")).toBe(false);
  });

  test("returns true for an own property whose value is undefined", () => {
    expect(hasKey({ a: undefined }, "a")).toBe(true);
  });

  test("returns true for inherited properties on the prototype chain", () => {
    expect(hasKey({}, "toString")).toBe(true);
  });

  test("returns true for inherited properties from a custom prototype", () => {
    const proto = { inherited: 1 };
    const data = Object.create(proto) as object;

    expect(hasKey(data, "inherited")).toBe(true);
  });

  test("returns false for properties not present on a null-prototype object", () => {
    const data = Object.create(null) as object;

    expect(hasKey(data, "toString")).toBe(false);
  });

  test("returns true for own properties on a null-prototype object", () => {
    const data = Object.assign(Object.create(null) as object, { a: 1 });

    expect(hasKey(data, "a")).toBe(true);
  });

  test("returns true for symbol keys", () => {
    const symbol = Symbol("test");

    expect(hasKey({ [symbol]: 1 }, symbol)).toBe(true);
  });

  test("returns true for numeric keys", () => {
    expect(hasKey({ 0: "a" }, 0)).toBe(true);
  });

  test("returns true for an array index that exists", () => {
    expect(hasKey([1, 2, 3], 1)).toBe(true);
  });

  test("returns false for an array index past the end", () => {
    expect(hasKey([1, 2, 3], 5)).toBe(false);
  });

  test("returns true for inherited array members", () => {
    expect(hasKey([1, 2, 3], "length")).toBe(true);
  });
});

describe("data-last", () => {
  test("returns true for an own property", () => {
    expect(pipe({ a: 1 }, hasKey("a"))).toBe(true);
  });

  test("returns false for a missing property", () => {
    expect(pipe({ a: 1 }, hasKey("b"))).toBe(false);
  });

  test("returns true for an own property whose value is undefined", () => {
    expect(pipe({ a: undefined }, hasKey("a"))).toBe(true);
  });

  test("returns true for inherited properties on the prototype chain", () => {
    expect(pipe({}, hasKey("toString"))).toBe(true);
  });

  test("returns false for properties not present on a null-prototype object", () => {
    const data = Object.create(null) as object;

    expect(pipe(data, hasKey("toString"))).toBe(false);
  });

  test("returns true for symbol keys", () => {
    const symbol = Symbol("test");

    expect(pipe({ [symbol]: 1 }, hasKey(symbol))).toBe(true);
  });

  test("returns true for numeric keys", () => {
    expect(pipe({ 0: "a" }, hasKey(0))).toBe(true);
  });
});
