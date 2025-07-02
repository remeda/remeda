import { expect, test } from "vitest";
import { entries } from "./entries";

test("should return pairs", () => {
  expect(entries({ a: 1, b: 2, c: 3 })).toStrictEqual([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]);
});

test("should ignore symbol keys", () => {
  expect(entries({ [Symbol("a")]: 1 })).toStrictEqual([]);
});

test("should turn numbers to strings", () => {
  expect(entries({ 1: "hello" })).toStrictEqual([["1", "hello"]]);
});

test("returns symbol values", () => {
  const mySymbol = Symbol("hello");

  expect(entries({ a: mySymbol })).toStrictEqual([["a", mySymbol]]);
});

test("works with complex objects as values", () => {
  const complexObject = { a: { b: { c: [{ d: true }, { d: false }] } } };

  expect(entries({ a: complexObject })).toStrictEqual([["a", complexObject]]);
});
