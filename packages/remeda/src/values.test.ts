import { expect, test } from "vitest";
import { values } from "./values";

test("works with arrays", () => {
  expect(values(["x", "y", "z"])).toStrictEqual(["x", "y", "z"]);
});

test("should return values of object", () => {
  expect(values({ a: "x", b: "y", c: "z" })).toStrictEqual(["x", "y", "z"]);
});

test("should skip symbol keys", () => {
  expect(values({ [Symbol("a")]: "x" })).toStrictEqual([]);
});

test("shouldn't skip symbol values", () => {
  const mySymbol = Symbol("mySymbol");

  expect(values({ a: mySymbol })).toStrictEqual([mySymbol]);
});
