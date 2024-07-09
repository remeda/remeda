import { entries } from "./entries";

it("should return pairs", () => {
  expect(entries({ a: 1, b: 2, c: 3 })).toStrictEqual([
    ["a", 1],
    ["b", 2],
    ["c", 3],
  ]);
});

it("should ignore symbol keys", () => {
  expect(entries({ [Symbol("a")]: 1 })).toStrictEqual([]);
});

it("should turn numbers to strings", () => {
  expect(entries({ 1: "hello" })).toStrictEqual([["1", "hello"]]);
});

it("returns symbol values", () => {
  const mySymbol = Symbol("hello");
  expect(entries({ a: mySymbol })).toStrictEqual([["a", mySymbol]]);
});

it("works with complex objects as values", () => {
  const complexObject = { a: { b: { c: [{ d: true }, { d: false }] } } };
  expect(entries({ a: complexObject })).toStrictEqual([["a", complexObject]]);
});
