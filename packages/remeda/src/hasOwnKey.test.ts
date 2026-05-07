import { describe, expect, test } from "vitest";
import { hasOwnKey } from "./hasOwnKey";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("returns true for an own property", () => {
    expect(hasOwnKey({ a: 1 }, "a")).toBe(true);
  });

  test("returns false for a missing property", () => {
    expect(hasOwnKey({ a: 1 }, "b")).toBe(false);
  });

  test("returns true for an own property whose value is undefined", () => {
    expect(hasOwnKey({ a: undefined }, "a")).toBe(true);
  });

  test("returns false for inherited prototype properties", () => {
    expect(hasOwnKey({}, "toString")).toBe(false);
  });

  test("returns false for properties only on a custom prototype", () => {
    const proto = { inherited: 1 };
    const data = Object.create(proto) as object;

    expect(hasOwnKey(data, "inherited")).toBe(false);
  });

  test("returns true for own properties on a null-prototype object", () => {
    const data = Object.assign(Object.create(null) as object, { a: 1 });

    expect(hasOwnKey(data, "a")).toBe(true);
  });

  test("returns false for missing properties on a null-prototype object", () => {
    const data = Object.create(null) as object;

    expect(hasOwnKey(data, "toString")).toBe(false);
  });

  test("returns true for own symbol keys", () => {
    const symbol = Symbol("test");

    expect(hasOwnKey({ [symbol]: 1 }, symbol)).toBe(true);
  });

  test("returns true for numeric keys", () => {
    expect(hasOwnKey({ 0: "a" }, 0)).toBe(true);
  });

  test("returns true for an array index that exists", () => {
    expect(hasOwnKey([1, 2, 3], 1)).toBe(true);
  });

  test("returns false for an array index past the end", () => {
    expect(hasOwnKey([1, 2, 3], 5)).toBe(false);
  });

  test("returns false for inherited array members", () => {
    expect(hasOwnKey([1, 2, 3], "push")).toBe(false);
  });

  test("returns true for the array length own property", () => {
    expect(hasOwnKey([1, 2, 3], "length")).toBe(true);
  });
});

describe("data-last", () => {
  test("returns true for an own property", () => {
    expect(pipe({ a: 1 }, hasOwnKey("a"))).toBe(true);
  });

  test("returns false for a missing property", () => {
    expect(pipe({ a: 1 }, hasOwnKey("b"))).toBe(false);
  });

  test("returns true for an own property whose value is undefined", () => {
    expect(pipe({ a: undefined }, hasOwnKey("a"))).toBe(true);
  });

  test("returns false for inherited prototype properties", () => {
    expect(pipe({}, hasOwnKey("toString"))).toBe(false);
  });

  test("returns true for own symbol keys", () => {
    const symbol = Symbol("test");

    expect(pipe({ [symbol]: 1 }, hasOwnKey(symbol))).toBe(true);
  });

  test("returns true for numeric keys", () => {
    expect(pipe({ 0: "a" }, hasOwnKey(0))).toBe(true);
  });
});
